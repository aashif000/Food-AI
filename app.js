var app = angular.module('foodAIApp', []);

app.controller('ChatBotController', ['$scope', '$http', 'FoodAIService', function($scope, $http, FoodAIService) {
  $scope.messages = [];
  $scope.userInput = '';
  $scope.loading = false;

  // Function to send message
  $scope.sendMessage = function() {
    if ($scope.userInput.trim() === '') return;

    var userMessage = {
      content: $scope.userInput,
      role: 'user'
    };

    $scope.messages.push(userMessage);
    $scope.loading = true;
    $scope.scrollToBottom(); // Scroll to bottom after new message

    // Call the service to get the response from the AI model (through the proxy)
    FoodAIService.generateResponse($scope.userInput)
      .then(function(response) {
        var aiMessage = {
          content: response.data.text || 'Sorry, no response generated.',
          role: 'assistant'
        };
        $scope.messages.push(aiMessage);
        $scope.loading = false;
        $scope.userInput = ''; // Clear input after sending
        $scope.scrollToBottom();
      })
      .catch(function(error) {
        var errorMessage = {
          content: 'Oops! Something went wrong. Please try again.',
          role: 'assistant'
        };
        $scope.messages.push(errorMessage);
        $scope.loading = false;
        console.error('Error:', error);
        $scope.scrollToBottom();
      });
  };

  // Scroll to the bottom of the chat window
  $scope.scrollToBottom = function() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  // Function to handle Enter key press
  $scope.checkEnterKey = function(event) {
    if (event.key === 'Enter') {
      $scope.sendMessage();
    }
  };
}]);

// Service to call the backend API (proxy)
app.service('FoodAIService', ['$http', function($http) {
  var apiUrl = 'http://localhost:3000/generate'; // Proxy endpoint

  // Function to call the backend API (server-side)
  this.generateResponse = function(userInput) {
    return $http.post(apiUrl, {
      prompt: `You are an expert in food-related queries. Please provide a helpful response to: "${userInput}"`,
      temperature: 0.5
    });
  };
}]);
