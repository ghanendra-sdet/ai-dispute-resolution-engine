/**
 * Sample Playwright + TypeScript test for the AI Dispute Resolution Engine.
 * Asserts on structured outcome data (intent classified, resolution state)
 * rather than exact AI response text, since conversational phrasing can
 * legitimately vary. All data below is DUMMY/SAMPLE data for portfolio
 * demonstration only — no real conversations or account data.
 */

import { test, expect, Page } from '@playwright/test';

// ── Dummy test data ─────────────────────────────────────────────
const CONNECTED_PRODUCTS = ['collection', 'payout', 'connectedBanking', 'bbps', 'yobo'] as const;

const DUMMY_TRANSACTION_QUERY = "Why is my transaction still showing as pending?";
const DUMMY_EMAIL_CHANGE_QUERY = "I'd like to update my registered email address.";
const DUMMY_AMBIGUOUS_QUERY = "It's not working, please help.";

// ── Chat session helper ─────────────────────────────────────────
class ChatSession {
  constructor(private page: Page) {}

  async goto(originProduct: string) {
    await this.page.goto(`/support/chat?product=${originProduct}`);
  }

  async sendMessage(text: string) {
    await this.page.getByTestId('chat-input').fill(text);
    await this.page.getByTestId('chat-send').click();
  }

  async getClassifiedIntent() {
    return this.page.getByTestId('debug-intent-label').innerText();
  }

  async getTicketStatus() {
    return this.page.getByTestId('ticket-status').innerText();
  }

  async getEscalationBanner() {
    return this.page.getByTestId('escalation-banner');
  }
}

// ── Tests ────────────────────────────────────────────────────────
test.describe('AI Dispute Resolution Engine — Intent Recognition', () => {
  test('correctly classifies a Transaction Status query', async ({ page }) => {
    const chat = new ChatSession(page);
    await chat.goto('collection');
    await chat.sendMessage(DUMMY_TRANSACTION_QUERY);

    await expect(chat.getClassifiedIntent()).resolves.toBe('TRANSACTION_STATUS');
  });

  test('ambiguous input triggers a clarifying question, not a guess', async ({ page }) => {
    const chat = new ChatSession(page);
    await chat.goto('payout');
    await chat.sendMessage(DUMMY_AMBIGUOUS_QUERY);

    // The AI should ask for more detail rather than committing to a category
    await expect(page.getByTestId('chat-response').last()).toContainText(/could you clarify|more detail/i);
  });
});

test.describe('AI Dispute Resolution Engine — Cross-Product Consistency', () => {
  for (const product of CONNECTED_PRODUCTS) {
    test(`resolves a Transaction Status query consistently when raised from ${product}`, async ({ page }) => {
      const chat = new ChatSession(page);
      await chat.goto(product);
      await chat.sendMessage(DUMMY_TRANSACTION_QUERY);

      await expect(chat.getClassifiedIntent()).resolves.toBe('TRANSACTION_STATUS');
      await expect(chat.getTicketStatus()).resolves.toMatch(/resolved|closed/i);
    });
  }
});

test.describe('AI Dispute Resolution Engine — Escalation', () => {
  test('security-sensitive email change escalates on failed verification', async ({ page }) => {
    const chat = new ChatSession(page);
    await chat.goto('connectedBanking');
    await chat.sendMessage(DUMMY_EMAIL_CHANGE_QUERY);

    // Simulate failing the dummy verification step
    await page.getByTestId('verification-fail-dummy-btn').click();

    await expect(chat.getEscalationBanner()).toBeVisible();
    await expect(chat.getTicketStatus()).resolves.toMatch(/escalated/i);
  });
});
