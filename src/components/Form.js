import { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Header,
  Image,
  Loader,
  Dimmer,
  Segment,
  Divider,
  Label,
} from 'semantic-ui-react';
import { PopoverPicker } from './PopoverPicker';
import Links from './Links';
import FileDrop from './Filedrop';
import { produce } from 'immer';
import { generate } from 'shortid';
import { fireEvent } from '@testing-library/dom';
// WorkshopForm is a simple form used for the Skynet Workshop
const WorkshopForm = (props) => {
  const [uploadPreview, setUploadPreview] = useState(props.fileSkylink);

  useEffect(() => {
    setUploadPreview(props.fileSkylink);
  }, [props.fileSkylink]);
  const [test, setTest] = useState([
    {
      id: '1',
      question: 'add question',
      answers: { a: 'answer1', b: 'answer2', c: 'answer2', d: 'answer2' },
      correctAnswer: 'correct answer',
    },
  ]);
  return (
    <>
      <Segment>

        {props.activeTab > 1 && (
          <>
            {props.loggedIn === true && (
              <Button onClick={props.handleMySkyLogout}>
                Log Out of MySky
              </Button>
            )}
            {props.loggedIn === false && (
              <Button color="green" onClick={props.handleMySkyLogin}>
                Login with MySky
              </Button>
            )}
            {props.loggedIn === null && <Button>Loading MySky...</Button>}
            {props.activeTab === 2 && (
              <Label pointing="left" color="green" basic>
                Once logged into MySky, we can save and load data in "files".
              </Label>
            )}
            <Divider />
          </>
        )}

        <Form onSubmit={props.handleSubmit}>
          {props.activeTab > 1 && (
            <>
              <Header as="h4">MySky File Data</Header>

              <Form.Field>
                <label>
                  Discoverable UserID <i>(Shared across MySky)</i>
                </label>
                <Input
                  placeholder="You must Login with MySky..."
                  value={props.userID}
                  icon="user circle"
                  iconPosition="left"
                />
              </Form.Field>
              <Form.Group>
                <Form.Field>
                  <label>File Path</label>
                  <Input
                    label={props.dataDomain + '/'}
                    placeholder="Enter rest of path."
                    value={props.dataKey}
                    onChange={(e) => {
                      props.setDataKey(e.target.value);
                    }}
                  />

                  {props.activeTab === 2 && (
                    <Label pointing basic color="green">
                      MySky Files are saved at a path. An app must have
                      permissions to write there.
                    </Label>
                  )}
                </Form.Field>
              </Form.Group>
              <Divider />
              <Form.Group>
                <Form.Input
                  label="Color"
                  placeholder="#000000"
                  value={props.userColor}
                  onChange={(e) => {
                    props.setUserColor(e.target.value);
                  }}
                />
                <Segment basic>
                  <PopoverPicker
                    style={{ bottom: 0 }}
                    color={props.userColor}
                    onChange={props.setUserColor}
                  />
                </Segment>
              </Form.Group>
              {props.activeTab > 2 && (
                <Form.Group inline>
                  <Button
                    variant="success"
                    disabled={props.loggedIn !== true || !props.dataKey}
                    onClick={(e) => {
                      props.loadData(e);
                    }}
                  >
                    Load Data from File
                  </Button>
                  <Button
                    style={{ marginLeft: '20px' }}
                    variant="success"
                    size="md"
                    disabled={
                      props.loggedIn !== true ||
                      !props.dataKey ||
                      !props.userColor
                    }
                    onClick={(e) => {
                      props.handleSaveAndRecord(e);
                    }}
                  >
                    Save Data and Record Update Action
                  </Button>
                  {props.activeTab === 3 && (
                    <Label pointing="left" basic color="green">
                      MySky + DAC!
                    </Label>
                  )}
                </Form.Group>
              )}
              <Divider />
            </>
          )}
          {/* Input for name */}
          {props.activeTab > 0 && (
            <>
              <Header as="h4">Input for Certificate</Header>
              <Form.Group>
                <Form.Input
                  label="Name"
                  placeholder="Enter your name"
                  value={props.name}
                  onChange={(e) => {
                    props.setName(e.target.value);
                  }}
                />
              </Form.Group>

              {props.test.map((q, index) => {
                return (
                  <>
                    <Header as="h4">Input for quiz</Header>
                    <Button
                      color='teal'
                      icon='add'
                      labelPosition='left'
                      onClick={() => {
                        setTest((currentquestion) => [
                          ...currentquestion,
                          {
                            id: generate(),
                            question: '',
                            answers: {},
                            correctAnswer: '',
                          },
                        ]);
                      }}
                    >
                      Add question
                    </Button>
                      <Form.Input 
                        placeholder="Enter your question"
                        onChange={(e) => {
                          const question = e.target.value;
                          setTest((currentquestion) =>
                            produce(currentquestion, (v) => {
                              v[index].question = question;
                            })
                          );
                        }}
                        value={q.question}
                      />
                      
                        <Form.Input
                          placeholder="answer 1"
                          onChange={(e) => {
                            const answer = e.target.value;
                            setTest((currentquestion) =>
                              produce(currentquestion, (v) => {
                                v[index].answers.a = answer;
                              })
                            );
                          }}
                          value={q.answer}
                        />
                        <Form.Input 
                          placeholder="answer 2"
                          onChange={(e) => {
                            const answer = e.target.value;
                            setTest((currentquestion) =>
                              produce(currentquestion, (v) => {
                                v[index].answers.b = answer;
                              })
                            );
                          }}
                          value={q.answer}
                        />
                        <Form.Input 
                          placeholder="answer 3"
                          onChange={(e) => {
                            const answer = e.target.value;
                            setTest((currentquestion) =>
                              produce(currentquestion, (v) => {
                                v[index].answers.c = answer;
                              })
                            );
                          }}
                          value={q.answer}
                        />
                        <Form.Input 
                          placeholder="answer 4"
                          onChange={(e) => {
                            const answer = e.target.value;
                            setTest((currentquestion) =>
                              produce(currentquestion, (v) => {
                                v[index].answers.d = answer;
                              })
                            );
                          }}
                          value={q.answer}
                        />
                      
                      <Form.Input
                        placeholder="correct answer"
                        onChange={(e) => {
                          const correctAnswer = e.target.value;
                          setTest((currentquestion) =>
                            produce(currentquestion, (v) => {
                              v[index].correctAnswer = correctAnswer;
                            })
                          );
                        }}
                        value={q.correctAnswer}
                      />
                    <Button
                      color='red'
                      content='Create New Order'
                      icon='delete'
                      labelPosition='left'
                      onClick={() => {
                        setTest((currentquestion) =>
                          currentquestion.filter((x) => x.id !== q.id)
                        );
                      }}
                    >
                      X
                    </Button>
                  </>
                );
              })}
            </>
          )}
          {/* Input for file */}
          <Header as="h4">Image Upload</Header>
          <Form.Group inline>
            <Form.Field>
              <label>Avatar Photo</label>
              <FileDrop
                settest={props.setTest(test)}
                setFile={props.setFile}
                setUploadPreview={setUploadPreview}
              />
            </Form.Field>
            <Image src={uploadPreview} size="small" />
          </Form.Group>
          {props.activeTab === 0 && (
            <Label pointing basic color="green">
              After uploading to Skynet, an immutable Skylink is returned!
            </Label>
          )}
          <Divider />
          <Button primary disabled={!uploadPreview} type="submit">
            Send to Skynet
          </Button>
          {props.activeTab === 1 && (
            <Label pointing="left" basic color="green">
              Now we'll upload a directory with an index.html file. The Skylink
              will be a website.
            </Label>
          )}
        </Form>
      </Segment>
      <Links
        fileSkylink={props.fileSkylink}
        webPageSkylink={props.webPageSkylink}
      />
    </>
  );
};

export default WorkshopForm;
