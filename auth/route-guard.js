export function protectRoute(expectedRole) {
    const token = localStorage.getItem("token");
    const onboarded = localStorage.getItem("onboardingCompleted");
    const role = localStorage.getItem("role")

    if (!role || onboarded) {
    window.location.replace("../onboarding/onboarding.html");
    return;
    }

    if (expectedRole && role !==expectedRole) {
        window.location.replace("/unathorized.html");
    }
}