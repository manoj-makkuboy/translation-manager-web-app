import logo from './logo.svg';
import React from 'react'
import './App.css';

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      availableLanguages: [], translations: {
        english: { HELLO_WORLD: "hello World", CANCEL: "cancel" },
        hindi: { HELLO_WORLD: "namaste duniya", CANCEL: "Nikalo" }
      }
    }
    this.constants = Object.keys(this.state.translations.english)
  }

  async componentDidMount() {
    let availableLanguages = (await (await fetch('http://localhost:3000/getLanguages')).json())
    console.log("available languages", availableLanguages)
    this.setState({ availableLanguages })
  }

  renderTitle = () => {
    return (
      <tr>
        <td>constant</td>
        {this.state.availableLanguages.map((item) => <td>{item}</td>)}
      </tr>
    )
  }

  renderData = () => {

    let tableRow = this.constants.map(constant => {
      return (
        <tr>
          <td>
            {constant}
          </td>
            {this.state.availableLanguages.map((language) => <td>{this.state.translations[language][constant]}</td>)}
        </tr>
        )
    })


    return (
      tableRow
    )
  }

  render() {
    return (
      <div className="App">
        <table>
          {this.renderTitle()}
          {this.renderData()}
        </table>

      </div>
    );
  }
}


export default App;
