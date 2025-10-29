// API 설정
const API_KEY = 'b116cf94be39c1ad207d99e00ae4ac36';
const API_URL = 'https://api.themoviedb.org/3/movie/now_playing';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM 요소
const moviesGrid = document.getElementById('moviesGrid');

// 영화 데이터 가져오기
async function fetchMovies() {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&language=ko-KR&page=1`);
        
        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        throw error;
    }
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    if (!dateString) return '미정';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 영화 카드 생성
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const posterUrl = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;
    
    const poster = posterUrl
        ? `<img src="${posterUrl}" alt="${movie.title}" class="movie-poster" onerror="this.parentElement.innerHTML='<div class=\'movie-poster-placeholder\'>포스터 없음</div>'">`
        : '<div class="movie-poster-placeholder">포스터 없음</div>';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseDate = formatDate(movie.release_date);
    
    card.innerHTML = `
        ${poster}
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-details">
                <div class="movie-rating">${rating}</div>
                <div class="movie-release-date">${releaseDate}</div>
            </div>
        </div>
    `;
    
    return card;
}

// 영화 목록 표시
function displayMovies(movies) {
    // 로딩 메시지 제거
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<div class="error">표시할 영화가 없습니다.</div>';
        return;
    }
    
    // 영화 카드 생성 및 추가
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        moviesGrid.appendChild(card);
    });
}

// 에러 메시지 표시
function displayError(error) {
    moviesGrid.innerHTML = `
        <div class="error">
            <p>영화를 불러오는 중 오류가 발생했습니다.</p>
            <p style="font-size: 14px; margin-top: 10px;">${error.message}</p>
        </div>
    `;
}

// 초기화 함수
async function init() {
    try {
        const movies = await fetchMovies();
        displayMovies(movies);
    } catch (error) {
        displayError(error);
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', init);
