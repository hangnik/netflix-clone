const API_KEY = "99eecbb71742e3c2ea984aaff7b11ba4";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE = "ko-KR";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface INowPlayingResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getNowPlayingMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
  ).then((reponse) => reponse.json());
}
