describe('Registration and Login', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('should register a new user', async () => {
    await element(by.id('registerButton')).tap();
    await element(by.id('displayNameInput')).typeText('Test User');
    await element(by.id('emailInput')).typeText('testuser@example.com');
    await element(by.id('passwordInput')).typeText('TestPassword123');
    await element(by.id('registerButton')).tap();
    // Wait for navigation or success message
    await expect(element(by.text('Registration successful! Please check your email to verify your account.'))).toBeVisible();
  });

  it('should log out and log in', async () => {
    // Assuming there is a logout button with testID 'logoutButton' on the home/profile screen
    // await element(by.id('logoutButton')).tap();
    await element(by.id('loginButton')).tap();
    await element(by.id('emailInput')).typeText('testuser@example.com');
    await element(by.id('passwordInput')).typeText('TestPassword123');
    await element(by.id('loginButton')).tap();
    // Wait for navigation or welcome message
    await expect(element(by.text('PetAdopt'))).toBeVisible();
  });
});
