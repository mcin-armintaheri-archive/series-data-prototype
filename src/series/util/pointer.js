export const getPosition = (event, offset = { top: 0, left: 0 }) => {
  const { top, left } = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - left - offset.left,
    y: event.clienY - top - offset.top
  };
};
