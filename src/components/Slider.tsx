import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { makeBgImagePath } from "../utils";
import { IMovie } from "../api";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const Wrapper = styled.div`
  position: relative;
  //display: flex;
`;

const Row = styled(motion.div)`
  //position: absolute;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  padding-inline: 8vw;
  justify-content: center;
`;

const Box = styled(motion.div)`
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
  & > img {
    width: 100%;
    height: auto;
  }
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
  opacity: 0;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 1rem;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 2vw;
  margin: 1.5rem 0;
  padding: 0 8vw;
  top: 0rem;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute;
  top: 12vw;
  padding: 0 2.75vw;
  z-index: 1;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3vw;
  height: 3vw;
  background-color: ${(prop) => prop.theme.black.lighter};
  border-radius: 50%;
  border: none;
  color: ${(prop) => prop.theme.white.darker};
  opacity: 0.7;
  transition: opacity 0.3s;
  & > svg {
    width: 1.25vw;
    height: 1.25vw;
  }
  &:hover {
    opacity: 1;
  }
`;

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth - 10 : window.outerWidth + 10,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth + 10 : -window.outerWidth - 10,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -20,
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface ISliderProps {
  title: string;
  sliderId: string;
  contents: IMovie[];
}

const offset = 6;

function Slider({ title, sliderId, contents }: ISliderProps) {
  const history = useHistory();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [goingback, setGoingBack] = useState(false);
  const increaseIndex = () => {
    if (contents) {
      if (leaving) return;
      toggleLeaving();
      setGoingBack(false);
      const maxIndex = Math.floor(contents.length / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (contents) {
      if (leaving) return;
      toggleLeaving();
      setGoingBack(true);
      const maxIndex = Math.floor(contents.length / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      <Title>{title}</Title>
      <AnimatePresence
        custom={goingback}
        initial={false}
        onExitComplete={toggleLeaving}
      >
        <Buttons>
          <Button onClick={decreaseIndex}>
            <SlArrowLeft />
          </Button>
          <Button onClick={increaseIndex}>
            <SlArrowRight />
          </Button>
        </Buttons>
        <Row
          key={index}
          custom={goingback}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
        >
          {contents
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                onClick={() => onBoxClicked(movie.id)}
                key={movie.id}
                variants={boxVariants}
                layoutId={sliderId + movie.id + ""}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
              >
                {movie.poster_path ? (
                  <img
                    src={makeBgImagePath(movie.poster_path, "w500")}
                    alt="movie_poster"
                  />
                ) : (
                  <h3>이미지없음</h3>
                )}
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Wrapper>
  );
}

export default Slider;
