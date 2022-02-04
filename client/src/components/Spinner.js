import React from "react";

const Spinner = () => {
  return (
    <div className="col-15 heading justify-content-center loading">
      <br />
      <br />
      <br />
      <br />
      <h1 align="center">
        <span className="fas fa-cog fa-spin text-primary"></span>
        <br />
        <br />
        Loading ...
      </h1>
    </div>
  );
};

export default Spinner;
