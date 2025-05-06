const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function fetchMovieDetails() {
  try {
    const response = await fetch(`/movies/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details.');
    }

    const movie = await response.json();

    document.getElementById('movie-title').innerText = movie.title || 'Title not available';
    document.getElementById('movie-duration').innerText = movie.runtime || 'Duration not available';
    document.getElementById('movie-year').innerText = movie.year || 'Year not available';
    document.getElementById('movie-director').innerText = movie.director || 'Director not available';
    document.getElementById('movie-genres').innerText = (movie.genres || []).join(', ') || 'Genres not available';
    document.getElementById('movie-actors').innerText = (movie.cast || []).join(', ') || 'Actors not available';
    document.getElementById('movie-rating').innerText = movie.imdb?.rating || 'Rating not available';
    document.getElementById('movie-language').innerText = (movie.languages || []).join(', ') || 'Language not available';
    document.getElementById('movie-plot').innerText = movie.fullplot || 'Plot not available';
    document.getElementById('movie-poster').src = movie.poster || '';
    document.getElementById('movie-poster').alt = movie.title || '';

    loadComments();

  } catch (error) {
    console.error('Failed to load movie details:', error);
    document.getElementById('movie-details').innerHTML = 'Failed to load movie details.';
  }
}

async function loadComments() {
  try {
    const response = await fetch(`/movies/${movieId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to load comments.');
    }

    const comments = await response.json();
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    if (comments.length === 0) {
      commentsContainer.innerHTML = '<p>No comments yet.</p>';
      return;
    }

    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.innerHTML = `
        <div class="comment-header">
          <button class="edit-button" onclick="startEditComment('${comment.id}', '${comment.text}')">✏️</button>
          <button class="delete-button" onclick="deleteComment('${comment.id}')">❌</button>
        </div>
        <div class="comment-text" id="comment-text-${comment.id}">
          <p>${comment.text}</p>
        </div>
        <div class="comment-date">
          <small>${new Date(comment.date).toLocaleString()}</small>
        </div>
      `;
      commentsContainer.appendChild(commentElement);
    });
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

async function addComment() {
  const commentInput = document.getElementById('comment-input');
  const text = commentInput.value.trim();

  if (!text) {
    alert('Please enter a comment.');
    return;
  }

  try {
    const response = await fetch(`/movies/${movieId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment.');
    }

    commentInput.value = '';
    loadComments();
  } catch (error) {
    console.error('Failed to add comment:', error);
  }
}

async function editComment(commentId, currentText) {
  const newText = prompt('Edit your comment:', currentText);
  if (!newText) return;

  try {
    const response = await fetch(`/movies/${movieId}/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });

    if (!response.ok) {
      throw new Error('Failed to edit comment.');
    }

    loadComments();
  } catch (error) {
    console.error('Failed to edit comment:', error);
  }
}

async function deleteComment(commentId) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  try {
    const response = await fetch(`/movies/${movieId}/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment.');
    }

    loadComments();
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
}

function startEditComment(commentId, currentText) {
  const commentTextDiv = document.getElementById(`comment-text-${commentId}`);
  commentTextDiv.innerHTML = `
    <textarea id="edit-comment-input-${commentId}" class="edit-comment-input">${currentText}</textarea>
    <div class="edit-actions">
      <button class="save-button" onclick="saveEditComment('${commentId}')">Save</button>
      <button class="cancel-button" onclick="cancelEditComment('${commentId}', '${currentText}')">Cancel</button>
    </div>
  `;
}

function cancelEditComment(commentId, originalText) {
  const commentTextDiv = document.getElementById(`comment-text-${commentId}`);
  commentTextDiv.innerHTML = `
    <p>${originalText}</p>
  `;
}

async function saveEditComment(commentId) {
  const editInput = document.getElementById(`edit-comment-input-${commentId}`);
  const newText = editInput.value.trim();

  if (!newText) {
    alert('The comment cannot be empty.');
    return;
  }

  try {
    const response = await fetch(`/movies/${movieId}/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });

    if (!response.ok) {
      throw new Error('Failed to save comment.');
    }

    loadComments(); 
  } catch (error) {
    console.error('Failed to save comment:', error);
  }
}

fetchMovieDetails();
