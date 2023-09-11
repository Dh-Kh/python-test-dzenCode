import  ReCAPTCHA  from "react-google-recaptcha";
import React, {useState, useRef} from "react";
import "./style_ws.css"


function CaptchaComponent() {
    const SITE_KEY = process.env.REACT_APP_SITE_KEY;
    const captchaRef = useRef(null);
    const [inputValueState, setInputValueState] = useState(null);
    const [tokenCaptcha, setTokenCaptcha] = useState(null);
    const [formInputRender, setFormInputRender] = useState(0);
    const eventRenderForm = () => {
        setFormInputRender((trigger_data) => trigger_data + 1);
    }

    const CaptchaSubmit = async (e) => {
        e.preventDefault();
        const inputValue  = await e.target[0].value;
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
        setInputValueState(inputValue);
        setTokenCaptcha(token);
    }
    const [isClikedCaptcha, setIsClikedCaptcha] = useState(false);
    const isCaptchaClicked = () => {
        setIsClikedCaptcha(true);
    }
    const FrontendCaptcha = (value) => {
        return(
        <div class="container">
            <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} onChange={isCaptchaClicked}/>
            <button onClick={() => {
                value();
                eventRenderForm();
            }} className="send button is-primary"
            disabled={!isClikedCaptcha}>Send Comment</button>
            
        </div>
        );
    }
    return {formInputRender, CaptchaSubmit, FrontendCaptcha, inputValueState, tokenCaptcha, setInputValueState, 
        setTokenCaptcha};
}
export default CaptchaComponent;
