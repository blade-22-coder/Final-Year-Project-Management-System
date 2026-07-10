export function protectRoute(expectedRole) {
    const token = localStorage.getItem("token");
    const onboarded = localStorage.getItem("onboardingCompleted");
    const role = localStorage.getItem("role")


    //Not Logged In
    if (!token) {
        window.location.replace("../auth/login.html");
        return;
    }

    //Not Onboarded yet
    if ((role === "STUDENT" || role === "SUPERVISOR") && !onboarded) {
    window.location.replace("../onboarding/onboarding.html");
    return;
    }

    //Role Mismatch
    if (expectedRole && role !==expectedRole) {
        window.location.replace("../unauthorized.html");
    }
}