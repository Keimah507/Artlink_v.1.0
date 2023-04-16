const React = require('react'); 
const { useEffect, useState } = require("react");
const { ReactDOM } = require("react-dom");
const UsersController = require("../../backend/controllers/UsersController");

function userProfile () {
    const [userData, setUserData] = useState({});
    useEffect(() =>{
        async function fetchData() {
            const response = await getUser();
            setUserData(response.data);
        }
        fetchData();
    }, []);
    const {username, bio, walletAddress, collections, creations} = userData;
    return (
        <>
  <div className="row align-items-center justify-content-center">
    <div className="col-lg-8">
      <div className="inner-heading text-center">
        <div className="mt-4">
          <h1 className="fw-bold">Your Profile</h1>
        </div>
      </div>
      <div className="heading-bottom-icon d-flex justify-content-center text-center">
        <i className="mdi mdi-image-filter-vintage" />
        <i className="mdi mdi-image-filter-vintage mx-2" />
        <i className="mdi mdi-image-filter-vintage" />
      </div>
    </div>
  </div>

  <div className="row mt-5 align-items-center">
    <div className="col-lg-6">
      <div className="d-flex align-items-center justify-content-start">
        <div className="avatar">
          <img
            src="images/inner-image/user/img-7.jpg"
            alt=""
            className="img-fluid avatar-xl border border-4 border-white rounded-circle"
          />
        </div>
        <div className="profile-name ms-3">
          <h6 className="fw-bold"> @mickel_fenn..</h6>
        </div>
      </div>
    </div>
    <div className="col-lg-6">
      <div className="d-flex align-items-lg-center justify-content-end">
        <div className="btn border-muted ">
          <p className="mb-0 text-muted">52f4B5d52Ghq..</p>
        </div>
        <div className="button ms-3">
          <button className="btn btn-dark">Follow</button>
        </div>
        <div className="d-flex ms-3">
          <div className="icon d-flex ms-auto">
            <div className="like">
              <a href="" className="text-primary">
                <i className="mdi mdi-heart" />
              </a>
            </div>
            <div className="menu  ms-3">
              <div className="dropdown rounded">
                <a
                  href=""
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className="text-primary"
                >
                  <i className="mdi mdi-dots-vertical"></i>
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* end row */}
  {/* start row */}
  <div className="row mt-4">
    <div className="col-lg-3">
      <div className="about-detail">
        <h6 className="fw-bold">About Me :</h6>
        <div className="details-box">
          <p className="text-muted f-16">
            Myself mickel_fenn.. The first person singular reflexive pronoun. A
            speaker or writer uses art .
          </p>
          <div className="row d-flex mt-4">
            <div className="col-lg-6">
              <p className="fw-semibold f-16 mb-0 text-muted">Collections</p>
              <p className="fw-semibold f-18">201</p>
            </div>
            <div className="col-lg-6">
              <p className="fw-semibold f-16 mb-0 text-muted">Creations</p>
              <p className="fw-semibold f-18">419</p>
            </div>
          </div>
        </div>
      </div>
      <div className="Social-detail mt-5">
        <h6 className="fw-bold">Follow Social Media :</h6>
        <div className="details-box">
          <div className="facebook d-flex align-items-center justify-content-start">
            <div className="avatar-xs bg-soft-muted">
              <i className="mdi mdi-facebook text-muted f-20" />
            </div>
            <div className="icon-content ms-2">
              <p className="mb-0">Facebook / @fenn_joy</p>
            </div>
          </div>
          <div className="message d-flex align-items-center justify-content-start mt-3">
            <div className="avatar-xs bg-soft-blue">
              <i className="mdi mdi-message-text text-blue f-20" />
            </div>
            <div className="icon-content ms-2">
              <p className="mb-0"> messenger / @fenn_joy</p>
            </div>
          </div>
          <div className=" whatsapp d-flex align-items-center justify-content-start mt-3">
            <div className="avatar-xs bg-soft-success">
              <i className="mdi mdi-whatsapp text-success f-20" />
            </div>
            <div className="icon-content ms-2">
              <p className="mb-0"> whatsapp / @fenn_joy</p>
            </div>
          </div>
          <div className=" whatsapp d-flex align-items-center justify-content-start mt-3">
            <div className="avatar-xs bg-soft-danger">
              <i className="mdi mdi-youtube text-danger f-20" />
            </div>
            <div className="icon-content ms-2">
              <p className="mb-0"> youtube / @fenn_joy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
    );
}

export default userProfile;
ReactDOM.render(<userProfile />, document.getElementById('user-profile'))