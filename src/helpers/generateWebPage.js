const generateWebPage = (name, test, imageSkylinkUrl, userID, filePath) => {
  return new File(
    [certificate(name, test, imageSkylinkUrl, userID, filePath)],
    'index.html',
    {
      type: 'text/html',
    },
	
  );
  
};

export default generateWebPage;

const skynetJsUrl =
  'https://siasky.net/_ADEqqK-rWNvj02l7EB67Qef7JEED8_3ITBaK5Iqt5HJ4w';

const certificate = (name, test='', imageSkylinkUrl, userID = '', filePath = '') => {
  // Define date variables
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const quest = test;
  // Define sources
  const resources =
    'https://siasky.net/PALEjinbHTTnydodyL370S9koJByTPBIdN5VlANcxfucmA';

  /* eslint-disable */
  return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title>Skynet Certificate</title>
		<meta name="description" content="Certificate">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="${resources}/css/reset.css" type="text/css" />
		<link rel="stylesheet" href="${resources}/css/style.css" type="text/css" />
		<script src="${skynetJsUrl}"></script>
	</head>

	<body>
		<div class="content-container">
			<div class="logo">
				<img src="${resources}/images/skynet-logo.svg" alt="Logo Skynet" />
			</div>
			
			<h1>Certificate Of Completion</h1>
			<div class="ribbon">
				<img src="${resources}/images/ribbon.png" alt="Ribbon" />
			</div>
					
			<h2>This Certificate is Awarded to</h2>
					
			<h3>${name}</h3>
			<h3>${quest}</h3>	
			<div class="completion">
				<p>For their completion of the</p>
			</div>
			
			<div class="workshop">
				<p>'Intro to Skynet workshop'</p>
			</div>
						
			<div class="date">
				<span>Awarded on ${month}/${day}/${year}</span>
			</div>
						
			<div class="avatar">
				<img id="certificate-avatar" src="${imageSkylinkUrl}" alt="Avatar">
			</div>
			<div id="quiz"></div>
			<button id="submit">Get Results</button>
			<div id="results"></div>				
			<footer>Sia Skynet 2021, all rights reserved</footer>				
		</div>

		<script>
		var question="${quest}"
		var test=[
			{
				"id": "1",
				"question": "what?",
				"answers": {
					"a": "az",
					"b": "zq",
					"c": "qq",
					"d": "se"
				},
				"correctAnswer": "a"
			},
			{
				"id": "FZxMvFpxB",
				"question": "what too",
				"answers": {
					"a": "az",
					"b": "zz",
					"c": "ze",
					"d": "er"
				},
				"correctAnswer": "a"
			},
			{
				"id": "xkzqO_ao2",
				"question": "what a new one",
				"answers": {
					"a": "ss",
					"b": "ssq",
					"c": "ssw",
					"d": "dc"
				},
				"correctAnswer": "a"
			},
			{
				"id": "oYSTKjSfi",
				"question": "",
				"answers": {},
				"correctAnswer": ""
			}
		]
		var quizContainer = document.getElementById('quiz');
		var resultsContainer = document.getElementById('results');
		var submitButton = document.getElementById('submit');
		generateQuiz(test, quizContainer, resultsContainer, submitButton);
		console.log(question, test)
		function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

			function showQuestions(questions, quizContainer){
				// we'll need a place to store the output and the answer choices
				var output = [];
				var answers;

				// for each question...
				for(var i=0; i<questions.length; i++){
					
					// first reset the list of answers
					answers = [];

					// for each available answer to this question...
					for(letter in questions[i].answers){

						// ...add an html radio button
						answers.push(
							'<label>'
								+ '<input type="radio" name="question'+i+'" value="'+letter+'">'
								+ letter + ': '
								+ questions[i].answers[letter]
							+ '</label>'
						);
					}

					// add this question and its answers to the output
					output.push(
						'<div class="question">' + questions[i].question + '</div>'
						+ '<div class="answers">' + answers.join('') + '</div>'
					);
				}

				// finally combine our output list into one string of html and put it on the page
				quizContainer.innerHTML = output.join('');
			}
		
			function showResults(questions, quizContainer, resultsContainer){
				// gather answer containers from our quiz
				var answerContainers = quizContainer.querySelectorAll('.answers');
				
				// keep track of user's answers
				var userAnswer = '';
				var numCorrect = 0;
				
				// for each question...
				for(var i=0; i<questions.length; i++){
			
					// find selected answer
					userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
					
					// if answer is correct
					if(userAnswer===questions[i].correctAnswer){
						// add to the number of correct answers
						numCorrect++;
						
						// color the answers green
						answerContainers[i].style.color = 'lightgreen';
					}
					// if answer is wrong or blank
					else{
						// color the answers red
						answerContainers[i].style.color = 'red';
					}
				}
			
				// show number of correct answers out of total
				resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
			}
		
			// show the questions
			showQuestions(questions, quizContainer);
		
			// when user clicks submit, show results
			submitButton.onclick = function(){
				showResults(questions, quizContainer, resultsContainer);
			}
		}
		function setHoverColor( color ){
			// find avatar and set a boxShadow with our SkyDB color on mouse hover
			document.getElementById("certificate-avatar").onmouseover = function() {
				this.style.boxShadow = "0 0 30px 10px "+color;
			}

			// find avatar and remove boxShadow on mouse exit
			document.getElementById("certificate-avatar").onmouseout = function() {
				this.style.boxShadow = "0 0 0px 0px "+color;
			}
		}

		// Only run this script if we're past step 3 and have a publicKey
		if ("${userID}"){

			// initialize our client
			const client = new skynet.SkynetClient();

			console.log("userid: ${userID}");
			console.log("filePath: ${filePath}");

			// get SkyDB entry, then...
			client.file.getJSON("${userID}", "${filePath}").then( ({data}) => {

				// call function with our SkyDB color
				setHoverColor(data.color);
				console.log(data.color);
			} );
		} else {
			setHoverColor("#57B560");
		}

		</script>


	</body>

</html>
`;
  /* eslint-enable */
};
