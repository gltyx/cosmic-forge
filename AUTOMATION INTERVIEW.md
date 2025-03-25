AUTOMATION INTERVIEW

"What factors do you consider when deciding whether to automate a test case? Provide an example of a good candidate for automation and one that should remain manual."
Repetition & Frequency – Automate tests that run frequently.
Stability of Functionality – Automate tests for features that don’t change often.
Data-Driven Scenarios – Good for automation when the same test needs to run with multiple inputs.
Critical Business Flows – Automate high-risk workflows like login, checkout, or API calls.

Good Candidate for Automation:
Login functionality – Stable, repeatable, critical to most applications.
Regression suite – Runs frequently and ensures existing functionality isn’t broken.
API testing – Doesn’t rely on UI and is quick to execute.

Should Remain Manual:
Exploratory testing – Requires human intuition and creativity.
UI/UX validation – Checking look & feel, layout, or usability.
One-time tests – E.g., testing a rare migration scenario.

Bonus if they mention return on investment (ROI).

"Have you worked with any automation tools or scripting languages? If so, which ones, and what was your experience with them?"

If they have experience:
I have worked with Selenium WebDriver for UI automation, mainly using Java/Python. I used TestNG/Pytest for test execution and reporting.
I have also explored Postman for API testing and basic scripting in JavaScript for UI test automation with Cypress.

If they have minimal experience:
I have been learning Selenium with Python and have written some basic automation scripts. I’m also familiar with running tests in Postman and using assertions in JavaScript.

Bonus points if they mention:
CI/CD integration (e.g., Jenkins, GitHub Actions)

A learning mindset: I am currently exploring Cypress/Playwright to expand my skills.

"Can you explain the Page Object Model (POM) in test automation? Why is it beneficial?"

Definition:
The Page Object Model (POM) is a design pattern in automation testing where each web page is represented as a class, and elements on that page are defined as variables. Actions (methods) are also included in the same class.

Why it’s beneficial:
Reduces code duplication – Reusable page methods avoid redundancy.
Improves maintainability – If a locator changes, we only update it in one place.
Increases readability & scalability – Separates test logic from UI interactions.

Example:
A LoginPage class might contain locators for username, password, and login button, along with a login() method. Test cases would then call LoginPage.login(username, password), making the test scripts cleaner.

Bonus points if they mention:
Using POM with frameworks like Selenium, Cypress, or Playwright.

"What strategies would you use to make element selectors more stable in an automation framework, especially when the UI layout changes frequently? What attributes would you prioritize when selecting locators?"

Strategies for stable selectors:
Use unique IDs whenever possible.
Leverage data-test attributes (data-test-id, aria-label).
Use stable CSS selectors instead of XPath.
Avoid absolute XPath (which is fragile).
Anchor to parent-child relationships (relative XPath if necessary).

Attribute prioritization:
ID i.e. #login-button
Data-test attributes ([data-test="username-input"]) – Added specifically for automation.
CSS selectors (button[type='submit']) – Faster than XPath.
Relative XPath (//button[contains(text(), 'Login')]) – Only if no better option exists.

"How would you use MITMProxy or Charles Proxy to test a mobile or web application? Can you provide a real-world scenario where these tools would be useful?"

How MITMProxy/Charles Proxy Helps in Testing:
Intercept & Inspect API Calls – Capture network requests & responses for debugging.
Modify Requests/Responses – Test how the app behaves with altered API responses.
Simulate Slow Networks – Throttle bandwidth to check app behavior on poor connections.
Test Security & SSL Pinning – Validate if an app enforces secure communication.
Mock Backend Responses – Simulate API responses without depending on a live backend.

Real-World Use Case:
I used Charles Proxy while testing a mobile app that fetches user profiles from an API. I intercepted the request, modified the response to inject invalid data, and tested how the app handled it. This helped uncover a bug where the app crashed when receiving unexpected fields.

"Here’s a screenshot of the login page for the application. What test cases would you run manually to validate that this page is working correctly? Please consider functional, usability, security, and other relevant factors."

Valid Login: Test that a valid username and password combination successfully logs the user in and redirects them to the correct page.
Invalid Login (Incorrect Credentials): Test that an invalid username or password shows the correct error message, such as Invalid username or password.
Blank Fields: Test that submitting the form with blank fields (both username and password) shows an appropriate error message, such as Please fill in all fields.
Password Visibility: Test that the password is hidden by default (using type=password), and that clicking the show password button reveals the password.
Case Sensitivity: Test that the system is case-sensitive for both username and password fields (e.g., Admin should not match admin).
Error Message on Incorrect Login: Test that the error message displayed for incorrect credentials is clear and consistent.
Login Button Disabled: Check that the login button is disabled if the username or password fields are empty or invalid.