const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator"); //this pakage for valid info
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Note");
const Note = require("../models/Note");

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
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
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

module.exports = router;
