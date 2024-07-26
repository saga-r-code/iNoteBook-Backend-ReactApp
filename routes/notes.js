const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator"); //this pakage for valid info
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Note");

//Router 1 : Get All notes using : GET "/api/notes/fetchnotes".// Login required
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const note = await Notes.find({ user: req.user.id });
    res.json([note]);
  } catch (error) {
    //if any mistake in code than show error and catch
    console.error(error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).send("Internal server error");
  }
});

//Router 2 : Add All notes using : POST "/api/notes/addnote".  // Login required
router.post(
  "/addnote", //endpoint
  fetchuser, //midleware through get user and login info
  [
    //Validation add
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({min: 5,}),
  ],
  async (req, res) => {
    try {
      //destruturing
      const { title, description, tag } = req.body;

      //Vaildation error check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //if error than return message and status
        return res.status(400).json({ errors: errors.array() });
      }

      //Add Notes:
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      //U can Also use this method to add notes
      //   const note = await Note.create({
      //     title: req.body.title,
      //     description: req.body.description,
      //     tag: req.body.tag,
      //     user: req.user.id,
      //   });

      const saveNotes = await note.save();

      res.json([saveNotes]);
    } catch (error) {
      //if any mistake in code than show error and catch
      console.error(error.message);
      console.error("Stack Trace:", error.stack);
      res.status(500).send("Internal server error");
    }
  }
);

//Router 3 : Update existing notes using : PATCH "/api/notes/updatenote".  // Login required
router.patch("/updatenote/:id", fetchuser, async (req, res) => { //PATCH method is update only the data which we changed not whole data and doesn't send whole payload
  //and put request is change whole payload even you can change one thing
  // book id enter
  try {
    const {title, description, tag} = req.body
    //Create newNote Object
    let newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    //Find the Note to be update and update it
    let note = await Notes.findById(req.params.id) // you can insert id for update user note details
    if(!note){
      return res.status(404).send("Note not found")
    }
    //Allow to update only if user owns this notes
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not allowed")
    }
    //Update the note
     note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true}) 
     //set: newmode get all details and , new: true means if you insert new data than add
     res.json(note)


    
  } catch (error) {
    //if any mistake in code than show error and catch
    console.error(error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).send("Internal server error");
  }
}
)

//Router 4 : Delete existing notes using : DELETE "/api/notes/deletenote".  // Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {  //book id enter
  try {
    //Find the Note to be delte and delte it
    let note = await Notes.findById(req.params.id) // you can insert id for update user note details
    if(!note){
      return res.status(404).send("Note not founded")
    }

    //Allow to deletion only if user owns this notes
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not allowed")
    }

    //Update the note
     note =await Notes.findByIdAndDelete(req.params.id) 
     //set: newmode get all details and , new: true means if you insert new data than add
     res.json({"Success":"Successfully Note deleted", note: note})


    
  } catch (error) {
    //if any mistake in code than show error and catch
    console.error(error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).send("Internal server error");
  }
}
)


module.exports = router;
