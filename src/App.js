// Import react components
import { useState, useEffect } from 'react';
import WorkshopForm from './components/Form';
import generateWebPage from './helpers/generateWebPage';
import { Header, Tab, Container } from 'semantic-ui-react';
import { ContentRecordDAC } from '@skynethq/content-record-library';
import { SkynetClient } from 'skynet-js';

const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);

const contentRecord = new ContentRecordDAC();

function App() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [file, setFile] = useState();
  const [fileSkylink, setFileSkylink] = useState('');
  const [name, setName] = useState('');
  const [webPageSkylink, setWebPageSkylink] = useState('');
  const [test, setTest] = useState('');
  const [dataKey, setDataKey] = useState('');
  const [userColor, setUserColor] = useState('#000000');
  const [filePath, setFilePath] = useState();
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    setFilePath(dataDomain + '/' + dataKey);
  }, [dataKey]);
  const dataDomain = 'localhost';

  useEffect(() => {
    /************************************************/
    /*        Step 3.2 Code goes here               */
    /************************************************/
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);

        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('form submitted');
    setLoading(true);

    const { skylink } = await client.uploadFile(file);

    const skylinkUrl = await client.getSkylinkUrl(skylink);

    console.log('File Uploaded:', skylinkUrl);

    setFileSkylink(skylinkUrl);
    const webPage = generateWebPage(name, test, skylinkUrl, userID, filePath);

    const webDirectory = {
      'index.html': webPage,
      // 'couldList.jpg': moreFiles,
    };

    const { skylink: dirSkylink } = await client.uploadDirectory(
      webDirectory,
      'certificate'
    );

    const dirSkylinkUrl = await client.getSkylinkUrl(dirSkylink);

    console.log('Web Page Uploaded:', dirSkylinkUrl);

    setWebPageSkylink(dirSkylinkUrl);

    const jsonData = {
      name,
      skylinkUrl,
      dirSkylinkUrl,
      color: userColor,
    };
    console.log(jsonData)
    await handleMySkyWrite(jsonData);

    setLoading(false);
  };

  const handleMySkyLogin = async () => {
    const status = await mySky.requestLoginAccess();
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };

  const handleMySkyLogout = async () => {
    /************************************************/
    /*        Step 3.4 Code goes here              */
    /************************************************/
    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID('');
  };

  const handleMySkyWrite = async (jsonData) => {
    try {
      console.log('userID', userID);
      console.log('filePath', filePath);
      await mySky.setJSON(filePath, jsonData);
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }
    try {
      await contentRecord.recordNewContent({
        skylink: jsonData.dirSkylinkUrl,
      });
    } catch (error) {
      console.log(`error with CR DAC: ${error.message}`);
    }
  };
  const loadData = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Loading user data from SkyDB');
    const { data } = await mySky.getJSON(filePath);

    if (data) {
      setName(data.name);
      setTest(data.test);
      setFileSkylink(data.skylinkUrl);
      setWebPageSkylink(data.dirSkylinkUrl);
      setUserColor(data.color);
      console.log('User data loaded from SkyDB!');
    } else {
      console.error('There was a problem with getJSON');
    }

    setLoading(false);
  };

  const handleSaveAndRecord = async (event) => {
    event.preventDefault();
    setLoading(true);

    console.log('Saving user data to MySky');

    const jsonData = {
      name,
      skylinkUrl: fileSkylink,
      dirSkylinkUrl: webPageSkylink,
      color: userColor,
    };

    try {
      await mySky.setJSON(filePath, jsonData);
      console.log("json data",jsonData)
      await contentRecord.recordInteraction({
        skylink: webPageSkylink,
        metadata: { action: 'updatedColorOf' },
      });
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }

    setLoading(false);
  };

  const formProps = {
    mySky,
    handleSubmit,
    handleMySkyLogin,
    handleMySkyLogout,
    handleSaveAndRecord,
    loadData,
    name,
    test,
    dataKey,
    userColor,
    activeTab,
    fileSkylink,
    webPageSkylink,
    loading,
    loggedIn,
    dataDomain,
    userID,
    setLoggedIn,
    setDataKey,
    setFile,
    setName,
    setTest,
    setUserColor,
  };
  const handleSelectTab = (e, { activeIndex }) => {
    setActiveTab(activeIndex);
  };

  const panes = [
    {
      menuItem: 'Part 1: File Upload',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Part 2: Folder Upload',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Part 3: MySky',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Part 4: Content Record DAC',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container>
      <Header
        as="h1"
        content="Skynet Workshop App"
        textAlign="center"
        style={{ marginTop: '1em', marginBottom: '1em' }}
      />
      <Tab
        menu={{ fluid: true, vertical: true, tabular: true }}
        panes={panes}
        onTabChange={handleSelectTab}
        activeIndex={activeTab}
      />
    </Container>
  );
}

export default App;
