import { useQuery } from "react-query";
import {
  INowPlayingResult,
  getNowPlayingMovies,
  getPopularMovies,
} from "../api";
import styled from "styled-components";
import { makeBgImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 80vh;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
`;

const Sliders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 4rem;
  font-weight: 100;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  width: 40vw;
  font-size: 1.2rem;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;

const BigCover = styled.div`
  width: 100%;
  height: 40vh;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  position: relative;
  width: 100%;
  top: -2rem;
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  padding: 1.5rem;
`;

const BigOverview = styled.p`
  padding: 1.5rem;
`;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { data: nowplayingData, isLoading: isNowPlayingLoading } =
    useQuery<INowPlayingResult>(["movies", "nowPlaying"], getNowPlayingMovies);

  const { data: popularData, isLoading: isPopularLoading } =
    useQuery<INowPlayingResult>(["movies", "popular"], getPopularMovies);

  const onOverlayClick = () => history.push("/");
  const clickMovie =
    bigMovieMatch?.params.movieId &&
    nowplayingData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isNowPlayingLoading || isPopularLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeBgImagePath(
              nowplayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowplayingData?.results[0].title}</Title>
            <Overview>{nowplayingData?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            <Slider
              title="지금 상영중인 영화"
              sliderId="now_playing"
              contents={nowplayingData ? nowplayingData.results.slice(1) : []}
            />
            <Slider
              title="인기 있는 영화"
              sliderId="popular"
              contents={popularData ? popularData.results : []}
            />
          </Sliders>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(rgba(24, 24, 24, 0.082), rgba(24, 24, 24, 0.686),rgb(24, 24, 24)), url(${makeBgImagePath(
                            clickMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickMovie.title}</BigTitle>
                      <BigOverview>{clickMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
