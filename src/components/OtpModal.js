import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/OTP.css";
function OtpModal() {
  const navigate = useNavigate();
  const [otpInput1, setotpInput1] = useState();
  const [otpInput2, setotpInput2] = useState();
  const [otpInput3, setotpInput3] = useState();
  const [otpInput4, setotpInput4] = useState();
  const [isResendDisabled, setResendDisabled] = useState(false);
  const otp = otpInput1 + otpInput2 + otpInput3 + otpInput4;
  console.log("otp", otp);
  const id = localStorage.getItem("id");
  function handleVerfiy(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: otp,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        if (data.message === "Email verified successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: `${data.message}`,
          });
          localStorage.setItem("isVerified", "true");
          navigate("/");
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: `${data.message}`,
          });
        }
      });
  }

  function handleResend(e, id) {
    e.preventDefault();
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/users/resend-verification-code/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Verification email resent successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: `${data.message}`,
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: `${data.message}`,
          });
        }
      });

    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 180000);
  }

  return (
    <>
      <div
        className="modal show "
        style={{
          display: "block",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          marginTop: "100px",
        }}
      >
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Enter OTP</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              We've sent a 4-digit verification code to your email address.
              Please enter it below:
            </p>
            <form onSubmit={handleVerfiy}>
              <div className="form-group d-flex justify-content-center gap-2">
                <input
                  type="text"
                  className=" otp-input"
                  id="otpInput1"
                  maxlength="1"
                  required
                  onChange={(e) => setotpInput1(e.target.value)}
                />
                <input
                  type="text"
                  className=" otp-input"
                  id="otpInput2"
                  maxlength="1"
                  required
                  onChange={(e) => setotpInput2(e.target.value)}
                />
                <input
                  type="text"
                  className=" otp-input"
                  id="otpInput3"
                  maxlength="1"
                  required
                  onChange={(e) => setotpInput3(e.target.value)}
                />
                <input
                  type="text"
                  className=" otp-input"
                  id="otpInput4"
                  maxlength="1"
                  required
                  onChange={(e) => setotpInput4(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block  mt-2 "
              >
                Submit
              </button>
            </form>
            <div className="text-center mt-3">
              <button
                id="resendButton"
                type="button"
                className="btn btn-secondary btn-sm "
                onClick={(e) => handleResend(e, id)}
                disabled={isResendDisabled}
              >
                Resend
              </button>
            </div>
          </Modal.Body>

          {/* <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Save changes</Button>
          </Modal.Footer> */}
        </Modal.Dialog>
      </div>
    </>
  );
}

export default OtpModal;
