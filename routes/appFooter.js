const express = require("express");
const router = express.Router();


const posts = [
  {
    title: "Best places to stay in Goa?",
    content: "Looking for budget-friendly stays near Baga Beach. Any suggestions?",
    author: "Rahul",
    createdAt: new Date()
  },
  {
    title: "How to get more bookings as a host?",
    content: "I listed my property in Jaipur. How can I improve visibility?",
    author: "Sneha",
    createdAt: new Date()
  },
  {
    title: "Is online payment safe on StayVerse?",
    content: "Just wanted to confirm payment security before booking.",
    author: "Amit",
    createdAt: new Date()
  }
];

// pages
router.get("/privacy", (req, res) => {
    res.render("footer/privacy");
});

router.get("/terms", (req, res) => {
    res.render("footer/terms");
});

router.get("/help", (req, res) => {
    res.render("footer/help");
});

router.get("/safety", (req, res) => {
    res.render("footer/safety");
});

router.get("/report-issue", (req, res) => {
    res.render("footer/report-issue");
});

router.get("/hosting-resources", (req, res) => {
    res.render("footer/hosting-resources");
});


router.get("/responsible-hosting", (req, res) => {
    res.render("footer/responsible-hosting");
});

router.post("/report-issue", (req, res) => {
    const { name, email, issueType, description } = req.body;

    console.log("Issue Reported:", { name, email, issueType, description });

    req.flash("success", "Issue submitted successfully!");
    res.redirect("/report-issue");
});



router.get("/community-forum", (req, res) => {
    res.render("footer/community-forum", { posts });
});

router.post("/community-forum", (req, res) => {
    const { title, content } = req.body;

    posts.unshift({
        title,
        content,
        author: req.user?.username || "Guest",
        createdAt: new Date()
    });

    req.flash("success", "Discussion posted!");
    res.redirect("/community-forum");
});

module.exports = router;