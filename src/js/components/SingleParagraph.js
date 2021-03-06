import React, { Component } from "react";
import { connect } from "react-redux";
import '../../css/SingleParagraph.css';
import { updateDeckElements, editParagraph, updateAudio } from "../actions/index";


/*
currentNoteEmphasisPhrase: "",
currentNoteClosed: false,
currentNoteEhphasis: false,
currentNoteHint: "".
currentNotePhrase: "",
*/

const mapStateToProps = state => {
  var currentCard = state.cards.filter(oneCard => oneCard.cardNumber  === state.currentCardNumber)[0];
  if (typeof currentCard === 'undefined') {
    var currentCard= {paragraph: '',
                  audioPath: '',
                 notes: []}
  }
  var currentNote = currentCard.notes.filter(oneNote => oneNote.noteNumber === state.currentNoteNumber)[0];

  if (typeof currentNote === 'undefined') {
    var currentNote= {emphasis: false,
                  noteNumber: 0,
                  closed: false,
                  currentNotePhrase: ""}
  }
  const toReturn={ currentCardNumber: state.currentCardNumber,
                   cards: state.cards,
                   currentNotePhrase: currentNote.wordPhrase,
                   currentNoteEmphasisPhrase: currentNote.emphasisPhrase,
                   currentNoteEmphasis: currentNote.emphasis,
                   currentNoteClosed: currentNote.closed,
                   currentNoteHint: currentNote.hint,
                   edit: state.edit,
                   paragraph: currentCard.paragraph,
                   audioPath: currentCard.audioPath,
                   showAudio: state.showAudio}
  return toReturn;
};

function mapDispatchToProps(dispatch) {
  return {
    updateDeckElements: newDeckElements => dispatch(updateDeckElements(newDeckElements)),
    editParagraph: paragraph => dispatch(editParagraph(paragraph)),
    updateAudio: audioMap => dispatch(updateAudio(audioMap))
  };
}

class OneParagraph extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleAudioChange = this.handleAudioChange.bind(this);
     this.editButton = this.editButton.bind(this);
    this.editClick= this.editClick.bind(this);
    this.quote=this.quote.bind(this);
    this.cleanText = this.cleanText.bind(this);
  }

  handleAudioChange(event) {
    const audio = event.target.value;
    this.props.updateAudio({audioPath: audio });
  }

  handleChange(event) {
    const paragraph = event.target.value;
    this.props.editParagraph({ paragraph });
  }

  editButton() {
    if (this.props.edit) {
      return (<button className="btn btn-danger btn-sm editButton">Save</button>)

    }
    else {
      return (<button className="btn btn-primary btn-sm editButton">Edit</button>)
    }
  }

  editClick() {
    this.props.updateDeckElements({edit: !this.props.edit});
  }

  quote(regex) {
    //temp remove question mark
    return regex.replace(/([()[{*+.$^\\|])/g, '\\$1');
  }

  cleanText(initialText) {
    var textMinusNL= initialText.replace(/(?:\r\n|\r|\n)/g, '<br>');
    var textMinusTab=textMinusNL.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    var textMinusWhiteSpace=textMinusTab.trim();
    var finalText = textMinusWhiteSpace;
    return finalText
  }

  /// green before the blue
  // green after the blue
  // green before and after the blue
  /// would blue ever be both green and black? // assume no
  // which means blue is either in green or not in green

    render() {

      const cards=this.props.cards;
      const currentCardNumber=this.props.currentCardNumber;
      const currentCard = cards.filter(oneCard => oneCard.cardNumber === currentCardNumber)[0];
      const currentParagraph = currentCard.paragraph;
      var currentNoteEmphasisPhrase = this.props.currentNoteEmphasisPhrase;
      //console.log("this.quote(currentNoteEmphasisPhrase");
      //console.log(this.quote(currentNoteEmphasisPhrase));

      //part of changing text that will break regex
    //  console.log("adding emphasis");

      if (typeof currentNoteEmphasisPhrase === 'undefined') {
        //|| currentNoteEmphasisPhrase.includes("\\")
        currentNoteEmphasisPhrase="";
      }
      else {
        //temp remove question mark
        currentNoteEmphasisPhrase=currentNoteEmphasisPhrase.replace(/[.*+^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        //"All of these should be escaped: \\ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] "
      }

      ///the regex is the emphasis phrase so it can be split at in the paragraph
      var noteEmphasisRegex = new RegExp("(" + currentNoteEmphasisPhrase + ")");
      var arrayOfStringsEmphasis = [];
      if (currentNoteEmphasisPhrase !== "") {
        arrayOfStringsEmphasis = currentParagraph.split(noteEmphasisRegex);
      } else {
          arrayOfStringsEmphasis.push(currentParagraph);
      }
      var stringsColoredEmp = []
      for (var index in arrayOfStringsEmphasis) {
        if (this.props.currentNoteEmphasis && arrayOfStringsEmphasis[index]===this.props.currentNoteEmphasisPhrase) {
          stringsColoredEmp.push({type: "emphasis",
                                  text: arrayOfStringsEmphasis[index]})
        }
        else {
          stringsColoredEmp.push({type: "normal",
                                  text: arrayOfStringsEmphasis[index]})
        }
      }
       // for each string in the array split it on the currentnote phrase and then make sure it's in the right spot then return it
       //eventually what we have is an array of normal plus green  then we check normal and if our blue is found in normal seperate it,
       // cards = [{text: "fdsfsdf",
        ///         color: "green"}]

      // basically we're going to search for this phrase (because we're splitting the paragraph on this phrase)
      var currentNotePhrase = this.props.currentNotePhrase;
      if (typeof currentNotePhrase === 'undefined' || currentNotePhrase.includes("\\")) {
        currentNotePhrase="";
      }
      console.log("currentnotephrase");
      console.log(currentNotePhrase);
      console.log("currentparagraph");
      console.log(currentParagraph);
      var currentPhraseRegex = new RegExp("(" + currentNotePhrase + ")");
      console.log("currentPhraseRegex");
      console.log(currentPhraseRegex);
      var arrayOfStringCurrentPhrase = []
      for (var indexStrEmp in stringsColoredEmp) {
        var splitForPhrase=[]
        splitForPhrase = stringsColoredEmp[indexStrEmp].text.split(currentPhraseRegex);
        for (var indexSecond in splitForPhrase) {
          if (splitForPhrase[indexSecond] === currentNotePhrase) {
            if (this.props.currentNoteClosed && currentNotePhrase !== "") {
              arrayOfStringCurrentPhrase.push({type: "wordPhrase",
                                             text: "(" + this.props.currentNoteHint + ") "})
            }
            else {
              arrayOfStringCurrentPhrase.push({type: "wordPhrase",
                                             text: splitForPhrase[indexSecond]})
                                           }
          }
          else {
            arrayOfStringCurrentPhrase.push({type: stringsColoredEmp[indexStrEmp].type,
                                             text: splitForPhrase[indexSecond]})
          }
        }
      }


  return (
    <div key="maindiv" className="container paragraphEditor">
    <div className="row">
  <div key="single1" className="SingleParagraph col-10">
   {!this.props.edit && arrayOfStringCurrentPhrase.map((oneStringMap, index) => {
     switch (oneStringMap.type) {
       case "wordPhrase":
        return <font key={index} color="sky blue">{oneStringMap.text}</font>
      case "emphasis":
      return <font key={index} color="green">{oneStringMap.text}</font>
      default:
      return <font key={index} color="">{oneStringMap.text}</font>
    }})}
    {this.props.edit &&
      <textarea
        className="editParagraph form-control"
        type="text"
        id="paragraph"
        value={this.props.paragraph}
        onChange={this.handleChange}
      />}
  </div>
  <div key="single2" className="EditButton col-2 mx-auto" onClick={this.editClick}>{this.editButton()}</div>
  </div>
  <div className="container editParagraphAudio">
  <div className="container editParagraph">
  <div className="editAudio row p-3">
  {this.props.showAudio &&
  <textarea
  className="form-control"
  key="single3"
    type="text"
    id="audioInput"
    placeholder="Audio"
    value={this.props.audioPath}  //{this.props.paragraph}
    onChange={(event) => this.handleAudioChange(event)}
  />}
  </div>
  </div>
  </div>
  </div>
);}}

const SingleParagraph = connect(mapStateToProps, mapDispatchToProps)(OneParagraph);

export default SingleParagraph;
