
let articles = JSON.parse(localStorage.getItem("articles")) || [
    {
        id: 1,
        title: "Artificial Intelligence: Future of Technology",
        category: "Technology",
        content: "Artificial Intelligence is changing the world. It is used in education, healthcare, business and many other fields.",
        likes: 5
    },
    {
        id: 2,
        title: "Importance of Sports in Life",
        category: "Sports",
        content: "Sports play an important role in maintaining physical fitness and mental health.",
        likes: 8
    },
    {
        id: 3,
        title: "Why Education is Important",
        category: "Education",
        content: "Education provides knowledge, skills and opportunities for a better future.",
        likes: 3
    },
    {
        id: 4,
        title: "How to Start a Business",
        category: "Business",
        content: "Starting a business requires planning, hard work, dedication and patience.",
        likes: 10
    }
];

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function saveData() {
    localStorage.setItem("articles", JSON.stringify(articles));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Reading time
function readingTime(content) {
    let words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

// Display articles
function displayArticles(list, elementId) {
    let output = "";

    if (list.length === 0) {
        output = "<p>No articles found.</p>";
    }

    list.forEach(function(article) {
        output += `
        <div class="article">
            <h3>${article.title}</h3>

            <p>Category: ${article.category}</p>

            <p>${article.content.substring(0, 100)}...</p>

            <p>Reading Time: ${readingTime(article.content)} min</p>

            <button onclick="likeArticle(${article.id})">
                ❤️ ${article.likes}
            </button>

            <button onclick="bookmarkArticle(${article.id})">
                🔖 Bookmark
            </button>

            <button onclick="openArticle(${article.id})">
                Read More
            </button>
        </div>
        `;
    });

    document.getElementById(elementId).innerHTML = output;
}

// Home page
function loadHome() {
    displayArticles(articles, "homeArticles");
}

// Navigation
function showPage(page) {
    let pages = [
        "home", "categories", "trending",
        "write", "bookmarks", "about", "articlePage"
    ];

    pages.forEach(function(p) {
        document.getElementById(p).classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    if (page === "home") {
        loadHome();
    }

    if (page === "trending") {
        let sorted = [...articles].sort(
            (a, b) => b.likes - a.likes
        );

        displayArticles(sorted, "trendingArticles");
    }

    if (page === "bookmarks") {
        let saved = articles.filter(function(a) {
            return bookmarks.includes(a.id);
        });

        displayArticles(saved, "savedArticles");
    }
}

// Search articles
function searchArticles() {
    let value = document.getElementById("search")
    .value.toLowerCase();

    let result = articles.filter(function(a) {
        return a.title.toLowerCase().includes(value) ||
               a.category.toLowerCase().includes(value);
    });

    displayArticles(result, "homeArticles");
}

// Category filter
function filterCategory(category) {
    let result = articles.filter(function(a) {
        return a.category === category;
    });

    displayArticles(result, "categoryArticles");
}

// Like article
function likeArticle(id) {
    let article = articles.find(function(a) {
        return a.id === id;
    });

    article.likes++;

    saveData();

    loadHome();

    if (!document.getElementById("trending").classList.contains("hidden")) {
        showPage("trending");
    }
}

// Bookmark article
function bookmarkArticle(id) {
    if (!bookmarks.includes(id)) {
        bookmarks.push(id);
        alert("Article bookmarked!");
    }
    else {
        alert("Already bookmarked!");
    }

    saveData();
}

// Open full article
function openArticle(id) {
    let article = articles.find(function(a) {
        return a.id === id;
    });

    document.getElementById("detailTitle").innerText =
    article.title;

    document.getElementById("detailCategory").innerText =
    "Category: " + article.category;

    document.getElementById("detailTime").innerText =
    "Reading Time: " + readingTime(article.content) + " minutes";

    document.getElementById("detailContent").innerText =
    article.content;

    showPage("articlePage");
}

// Add new article
function addPost() {
    let title = document.getElementById("title").value.trim();

    let category = document.getElementById("postCategory").value;

    let content = document.getElementById("content").value.trim();

    if (title === "" || content === "") {
        alert("Please fill all fields!");
        return;
    }

    let newArticle = {
        id: Date.now(),
        title: title,
        category: category,
        content: content,
        likes: 0
    };

    articles.unshift(newArticle);

    saveData();

    alert("Article published successfully!");

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    showPage("home");
}

// Initial loading
saveData();
loadHome();
