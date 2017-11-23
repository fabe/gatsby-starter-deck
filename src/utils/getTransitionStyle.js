const getTransitionStyles = timeout => {
  return {
    entering: {
      opacity: 0,
    },
    entered: {
      transition: `opacity ${timeout}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
      opacity: 1,
    },
    exiting: {
      transition: `opacity ${timeout}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
      opacity: 0,
    },
  };
};

const getTransitionStyle = ({ timeout, status }) =>
  getTransitionStyles(timeout)[status];

export default getTransitionStyle;
