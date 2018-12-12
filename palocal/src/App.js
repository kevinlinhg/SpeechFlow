import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PageHome from './PageHome';
import PageLogin from './PageLogin';
import PagePDF from './PagePDF';
import PageVideo from './PageVideo';
import PageNonsense from './PageNonsense';

import socketIOClient from 'socket.io-client';
class App extends Component {
  state = {
    data: null,
    messageFromSocketServer: null,
    socket: socketIOClient('https://paexpress.herokuapp.com/')
  };

  componentDidMount() {
    document.title = 'SpeechFlow';
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));

    // On interval event
    this.state.socket.on('Interval Event', msg =>
      this.setState({ messageFromSocketServer: msg })
    );

    this.state.socket.on('SOMEONE CLICKED THE DOWN BUTTON!!!!', function() {
      console.log('down message recieived');
    });

    this.state.socket.on('SOMEONE CLICKED THE UP BUTTON!!!!', function() {
      console.log('up message recieived');
    });

    this.state.socket.on('SOMEONE CLICKED THE LEFT BUTTON!!!!', function() {
      console.log('left message recieived');
    });

    this.state.socket.on('SOMEONE CLICKED THE RIGHT BUTTON!!!!', function() {
      console.log('right message recieived');
    });
  }

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route
              exact
              path="/"
              render={props => (
                <PageHome
                  {...props}
                  socket={this.state.socket}
                  data={this.state.data}
                  messageFromSocketServer={this.state.messageFromSocketServer}
                />
              )}
            />
            <Route
              path="/login"
              render={props => <PageLogin {...props} data={this.state.data} />}
            />
            <Route
              path="/PagePDF"
              render={props => (
                <PagePDF
                  {...props}
                  socket={this.state.socket}
                  data={this.state.data}
                />
              )}
            />
            <Route
              path="/PageVideo"
              render={props => (
                <PageVideo
                  {...props}
                  data={this.state.data}
                  socket={this.state.socket}
                />
              )}
            />
          </div>
        </BrowserRouter>
        {/* <PageNonsense data={this.state.data} /> */}
      </div>
    );
  }
}

export default App;
