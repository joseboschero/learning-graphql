export const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return <div style={{ color: "red", width: "100%" }}>{errorMessage}</div>;
};
