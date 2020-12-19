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

  handleAddButtonClick = () => {

  }

  renderEmptyRow = () => {
    return (
      <tr>
        <td><input></input></td>
        {this.state.availableLanguages.map((lang) => <td><input/></td>)}
      </tr>
    )
  }


  renderAddButton = () => {
    return (<button title="add" onClick={this.handleAddButtonClick}>
      add
    </button>)
  }

  handleSave = async () => {

    let request = {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(this.state.translations)// JSON.stringify(data) // body data type must match "Content-Type" header
    }
    let response = await (await fetch(BASE_URL+"/translation", request)).json()
    console.log("response of save ", response)
  }

  renderSaveButton = () => {
    return (<button title="add" onClick={this.handleSave}>
      Save
    </button>)
  }

  childSave = (childState, clearChild) => {
    let translationClone = {...this.state.translations}
    for(let i=0; i< this.state.availableLanguages.length; i++){
      translationClone[this.state.availableLanguages[i]][childState.constant] = childState[this.state.availableLanguages[i]]
    }
    this.setState({translations: translationClone})
    console.log("translation clone ", translationClone)
    clearChild()
  }

  renderTable = () => {
    return (
      <table>
      {this.renderTitle()}
      {this.renderData()}
      {/* {this.renderEmptyRow()} */}
      <EmptyRow availableLanguages={this.state.availableLanguages} translations={this.state.translations} childSave={this.childSave}/>

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
        {this.renderSaveButton()}
      </div>
    );
  }
}

class EmptyRow extends React.Component {


  constructor(props){
    super(props)
    console.log("child props", props)
    this.languageTextState = {}
    for(let i=0;i< props.availableLanguages.length; i++){
      this.languageTextState[props.availableLanguages[i]] = ""
    }
    this.state = {constant: "", ...this.languageTextState}
  }

  
  clearChildState = () => {
    for(let i=0;i< this.props.availableLanguages.length; i++){
      this.languageTextState[this.props.availableLanguages[i]] = ""
    }
    this.setState({constant: "", ...this.languageTextState})
  }

  handleOnChangeConstant = (event) => {
    this.setState({constant: event.target.value})
  }

  handleOnChange = (event, lang) => {
    let newState = {}
    newState[lang] = event.target.value
    console.log("new state onchange", newState)
    this.setState(newState)
  }

  handleOnClickAddNew = () => {
    this.props.childSave(this.state, this.clearChildState)
  }

  render() {

    console.log("state in child", this.state)
    return (
      <tr>
        <td><input value={this.state.constant} onChange={this.handleOnChangeConstant}></input></td>
        {this.props.availableLanguages.map((lang) => <td><input value={this.state[lang]} onChange={(event) => this.handleOnChange(event, lang)}/></td>)}
        <td><button onClick={this.handleOnClickAddNew}> Add New </button></td>
      </tr>
    )
  }
}


export default App;
