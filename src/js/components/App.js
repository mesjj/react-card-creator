import React from "react";
import Editor from "./Editor";
//import Form from "./Form";
//import List from "./List";
import '../../css/bootstrap.min.css'
import '../../css/App.css'

//ximport SidePanel from "./SidePanel";

const App = () => (
  <>
    <div className="appGeneral">
      <Editor />
    </div>
  </>
);

export default App;


/// features bugs
/// [ ] can't exist in audio file names
/// sidepanel numbers are index numbers instead (fixed?)
// failed on card should return error
//  large paragraphs don't fit well
// especially with audio visible
// special characters probably just need to be escaped
// paragraph input only automatically closes if it's nto empty
