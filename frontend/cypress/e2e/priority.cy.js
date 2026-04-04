describe('Priority Score API Test', () => {
  const apiUrl = '/api/test/priority-score';

  it('calculates priority score for urgent products with near deadline', () => {
    cy.request({
      url: apiUrl,
      qs: {
        days: 1,
        urgent: true,
        age: 2
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('score');
      expect(response.body.score).to.eq(31);
    });
  });

  it('handles negative values correctly', () => {
    cy.request({
      url: apiUrl,
      qs: {
        days: -5,
        urgent: false,
        age: 0
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.score).to.eq(15); // (10 - (-5)) + 0 + 0 = 15
    });
  });

  it('handles zero values correctly', () => {
    cy.request({
      url: apiUrl,
      qs: {
        days: 0,
        urgent: false,
        age: 0
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.score).to.eq(10); // (10 - 0) + 0 + 0 = 10
    });
  });
});
