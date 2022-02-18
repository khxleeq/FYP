import React from "react";


const LandingPage = () => {
  return (
    <div className="container homeInfo ">
        <br />
        <br />
        <br />
        <br />
          <h1 className=" row mt-3 homeTitle" align="center">Online Library Management system</h1>
        <br />
        <br />
        <br />
        <br />
        <div className="homestudentInfo">
            Hi students! you can use this to check the availablity of the books you’re looking for and can browse through all the books we have in store.
        </div>

        <br />
        <br />
        <br />
        <br />
        <div className="row libraryTimings ">
          <table>
            <tr>
              <th colspan="2">
                <h6>LIBRARY OPEN TIMINGS</h6>
              </th>
            </tr>
            <tr>
              <td>
                <h6>Weekdays:</h6>
              </td>
              <td>
                <h6>9.00 A.M - 9.00 P.M</h6>
              </td>
            </tr>
            <tr>
              <td>Weekends: </td> <td> 10.00 A.M - 5.30 P.M</td>
            </tr>
          </table>
          <br />
          <br />
        </div>
      </div>
  )
}

export default LandingPage;
  