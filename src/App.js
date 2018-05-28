import React, { Component } from "react"
import "./App.css"
import Card from "./card/card"
import Draw from "./draw/draw"
import { DB_CONFIG } from "./config/firebase/db_config"
import firebase from "firebase/app"
import "firebase/database"

class App extends Component {
  constructor(props) {
    super(props)

    this.app = firebase.initializeApp(DB_CONFIG)
    this.database = this.app
      .database()
      .ref()
      .child("cards")
    this.updateCard = this.updateCard.bind(this)

    this.state = {
      cards: [],
      currentCard: {}
    }
  }

  componentWillMount() {
    const currentCards = this.state.cards
    this.database.on("child_added", snap => {
      currentCards.push({
        id: snap.key,
        eng: snap.val().eng,
        esp: snap.val().esp
      })
      this.setState({
        cards: currentCards,
        currentCard: this.getRandomCard(currentCards)
      })
    })
  }

  getRandomCard(currentCards) {
    let card = currentCards[Math.floor(Math.random() * currentCards.length)]
    return card
  }

  updateCard() {
    const currentCards = this.state.cards
    this.setState({
      currentCard: this.getRandomCard(currentCards)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="cardRow">
          <Card
            eng={this.state.currentCard.eng}
            esp={this.state.currentCard.esp}
          />
        </div>
        <div className="buttonRow">
          <Draw drawCard={this.updateCard} />
        </div>
      </div>
    )
  }
}

export default App
