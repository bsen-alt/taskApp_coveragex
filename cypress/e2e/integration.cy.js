describe('Task Management App', () => {
  beforeEach(() => {
    // ridirect to app URL before each test
    cy.visit('http://localhost:8081');
  });

  it('should add a new task', () => {
    cy.get('[data-cy="task-title"]').type('Test Task'); // Task title input
    cy.get('[data-cy="task-description"]').type('Test task description'); // Task description input
    cy.get('[data-cy="add-task-button"]').click(); // Add task button

    // Confirm that the task appears in the task list
    cy.contains('Test Task').should('be.visible');
  });



  it('should change task status to "Hold"', () => {
    // find the task
    cy.contains('Test Task').click();
    
    // Click the "Hold" button in the button group
    cy.get('[data-cy="hold-button"]').click();
  
    // Confirm that the task status is now on "Hold"
    cy.contains('Hold').should('be.visible');
  });
  



  it('should delete a task', () => {
    // find the task
    cy.contains('Test Task').click();
  
    // click the delete task button
    cy.get('[data-cy="delete-task-button"]').click();
  
    // confirm that the confirmation modal is visible
    cy.get('[data-cy="delete-confirmation-modal"]').should('be.visible');
  
    // click the "Delete" button to delete
    cy.get('[data-cy="confirm-delete-button"]').click();
  
    // confirm that the task no longer exists
    cy.contains('Test Task').should('not.exist');
  });
  

  
  it('should not delete a task when canceled', () => {
    // find the task
    cy.contains('Test Task').click();
  
    // click the delete task button
    cy.get('[data-cy="delete-task-button"]').click();
  
    // confirm that the confirmation modal is visible
    cy.get('[data-cy="delete-confirmation-modal"]').should('be.visible');
  
    // click the "Cancel" button to cancel the deletion
    cy.get('[data-cy="cancel-delete-button"]').click();
  
    // confirm that the task still exists
    cy.contains('Test Task').should('be.visible');
  });
  
});
