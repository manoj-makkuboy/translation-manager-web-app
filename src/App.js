import logo from './logo.svg';
import React from 'react'
import './App.css';

const BASE_URL = "http://localhost:3000"

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      availableLanguages: [], translations: {}
    }
  }

  async componentDidMount() {
    let availableLanguages = (await (await fetch(BASE_URL + '/getLanguages')).json())
    console.log("available languages", availableLanguages)

    let translations = (await (await fetch(BASE_URL + '/getTranslation')).json())
    this.setState({ availableLanguages, translations })
    console.log("fetched translations ", translations)
  }

  renderTitle = () => {
    return (
      <tr>
        <td>constant</td>
        {this.state.availableLanguages.map((item) => <td>{item}</td>)}
      </tr>
    )
  }

  onChangeHandle = (language, constant, event) => {
    console.log("event", event)
    console.log("language", language)
    console.log("constant", constant)

    let translationsClone = { ...this.state.translations }
    console.log("translationsClone", translationsClone)
    translationsClone[language][constant] = event.target.value
    this.setState({ translations: translationsClone })
  }

  renderData = () => {

    if (!this.state.translations)
      return null

    let tableRow = this.constants.map(constant => {
      return (
        <tr>
          <td>
            <input value={constant} />
          </td>
          {
            this.state.availableLanguages.map((language) =>
              <td>
                <input value={this.state.translations[language][constant]} onChange={(event) => this.onChangeHandle(language, constant, event)} />
              </td>)
          }
        </tr>
      )
    })


    return (
      tableRow
    )
  }


  renderAddButton = () => {
    return (<button title="add">
      add
    </button>)
  }

  handleSave = async () => {

  }

  renderSaveButton = () => {
    return (<button title="add" onClick={this.handleSave}>
      Save
    </button>)
  }

  renderTable = () => {
    return (
      <table>
      {this.renderTitle()}
      {this.renderData()}
    </table>
    )
  }

  noDataView = () => {
    return (
      <h2>No data present</h2>
    )
  }

  render() {
    this.constants = Object.keys(this.state.translations).length !== 0 && Object.keys(this.state.translations.english)

    return (
      <div className="App">
        {this.constants ? this.renderTable() : this.noDataView()}
        {this.renderAddButton()}
        {this.renderSaveButton()}
      </div>
    );
  }
}


export default App;
