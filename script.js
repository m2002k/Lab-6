document.addEventListener("DOMContentLoaded", function () {
    // Elements and values
    const likeButton = document.getElementById("likeButton");
    const dislikeButton = document.getElementById("dislikeButton");
    const likeCountElem = document.getElementById("likeCount");
    const dislikeCountElem = document.getElementById("dislikeCount");
    const commentInput = document.getElementById("commentInput");
    const commentSubmit = document.getElementById("commentSubmit");
    const commentsList = document.getElementById("commentsList");
    const resetBtn = document.getElementById("resetBtn");
    let likeCount = parseInt(getCookie("likeCount")) || 100;
    let dislikeCount = parseInt(getCookie("dislikeCount")) || 20;
    let userVote = getCookie("userVote"); // "like", "dislike", or null
    let comments = JSON.parse(localStorage.getItem("comments") || "[]");

    likeCountElem.textContent = likeCount;
    dislikeCountElem.textContent = dislikeCount;
    renderComments();

    if (userVote) {
        disableVoting();
    } else {
        enableCommenting();
    }

    // Handle Like Button Click
    likeButton.addEventListener("click", function () {
        if (!userVote) {
            likeCount++;
            likeCountElem.textContent = likeCount;
            setCookie("likeCount", likeCount, 7);
            setCookie("userVote", "like", 7);
            userVote = "like"; 
            disableVoting();
            enableCommenting();
        }
    });

    // Handle Dislike Button Click
    dislikeButton.addEventListener("click", function () {
        if (!userVote) {
            dislikeCount++;
            dislikeCountElem.textContent = dislikeCount;
            setCookie("dislikeCount", dislikeCount, 7);
            setCookie("userVote", "dislike", 7);
            userVote = "dislike"; 
            disableVoting();
            enableCommenting();
        }
    });

    // Handle Comment Submission
    commentSubmit.addEventListener("click", function () {
        const commentText = commentInput.value.trim();
        if (commentText) {
            comments.push(commentText);
            localStorage.setItem("comments", JSON.stringify(comments)); // Store in localStorage
            renderComments();
            commentInput.value = ""; // Clear input
        }
    });

    // Reset Functionality
    resetBtn.addEventListener("click", function () {
        if (userVote === "like") {
            likeCount = Math.max(0, likeCount - 1);
            setCookie("likeCount", likeCount, 7);
        } else if (userVote === "dislike") {
            dislikeCount = Math.max(0, dislikeCount - 1);
            setCookie("dislikeCount", dislikeCount, 7);
        }

        deleteCookie("likeCount");
        deleteCookie("dislikeCount");
        deleteCookie("userVote");
        localStorage.removeItem("comments");

        comments = [];
        userVote = null;

        likeCountElem.textContent = likeCount;
        dislikeCountElem.textContent = dislikeCount;
        commentsList.innerHTML = "";

        enableVoting();
        disableCommenting();
    });

    // Disable and Enable functions
    function disableVoting() {
        likeButton.disabled = true;
        dislikeButton.disabled = true;
    }

    function enableVoting() {
        likeButton.disabled = false;
        dislikeButton.disabled = false;
    }

    function enableCommenting() {
        commentInput.disabled = false;
        commentSubmit.disabled = false;
    }

    function disableCommenting() {
        commentInput.disabled = true;
        commentSubmit.disabled = true;
    }

    // Render Comments
    function renderComments() {
        commentsList.innerHTML = comments
            .map(comment => `<p class="comment">${comment}</p>`)
            .join("");
    }

    // Cookie Functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
        return cookies[name] || "";
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
});
