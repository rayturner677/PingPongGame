from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestLogin:
    def setup_method(self):
        self.browser = Firefox()

    def teardown_method(self):
        self.browser.quit()

    def test_login_success(self):
        self.browser.get('http://localhost:5500')
        assert 'Login' in self.browser.find_element_by_id('nav-login').text
        self.browser.find_element_by_id('nav-login').click()
        assert 'username:' in self.browser.find_element_by_id(
            'login-label').text
        user_input = self.browser.find_element_by_id('username-login')
        assert bool(user_input)  # testing to see if login input field exists
        user_input.send_keys("ray")
        password_input = self.browser.find_element_by_id('user-password')
        password_input.send_keys('password')
        self.browser.find_element_by_class_name('submit-button').click()
        WebDriverWait(self.browser, 10).until(
            EC.text_to_be_present_in_element((By.ID, 'welcome-user'), 'ray'))
