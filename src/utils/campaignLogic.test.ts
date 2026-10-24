import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRunway,
  calculateWithdrawalFee,
  validateWithdrawal,
  filterCampaigns,
} from './campaignLogic.ts';
import type { Campaign } from './campaignLogic.ts';

test('calculateRunway calculates remaining budget and days left accurately', () => {
  const result = calculateRunway(500, 315.5, 20.7);
  assert.equal(result.remaining, 184.5);
  assert.equal(result.daysLeft, 8); // floor(184.5 / 20.7) = 8
  assert.ok(result.percentSpent > 63 && result.percentSpent < 64);
});

test('calculateWithdrawalFee handles bank account (0%) and debit card (1%)', () => {
  assert.equal(calculateWithdrawalFee(100, 'bank'), 0);
  assert.equal(calculateWithdrawalFee(128.5, 'card'), 1.29);
  assert.equal(calculateWithdrawalFee(50, 'card'), 0.5);
});

test('validateWithdrawal enforces valid amounts, limits and $50 minimum', () => {
  assert.equal(validateWithdrawal(0, 128.5).valid, false);
  assert.equal(validateWithdrawal(-10, 128.5).valid, false);
  assert.equal(validateWithdrawal(30, 128.5).valid, false);
  assert.match(validateWithdrawal(30, 128.5).error || '', /Minimum withdrawal is \$50/);
  assert.equal(validateWithdrawal(150, 128.5).valid, false);
  assert.match(validateWithdrawal(150, 128.5).error || '', /more than your available balance/);
  assert.equal(validateWithdrawal(100, 128.5).valid, true);
  assert.equal(validateWithdrawal(128.5, 128.5).valid, true);
});

test('filterCampaigns correctly filters discover, joined, and hosting', () => {
  const mockCampaigns: Campaign[] = [
    {
      id: 'c1',
      name: 'App 1',
      b: 'B1',
      tag: 't1',
      cat: 'Photography',
      host: 'H1',
      bg: '#fff',
      fg: '#000',
      ic: 'camera',
      days: 10,
      n: 20,
      price: '0.40',
      end: 'Oct 29',
      d: 'd1',
      d2: 'd2',
    },
    {
      id: 'c2',
      name: 'App 2',
      b: 'B2',
      tag: 't2',
      cat: 'Finance',
      host: 'H2',
      bg: '#fff',
      fg: '#000',
      ic: 'coin',
      days: 20,
      n: 10,
      price: '0.80',
      end: 'Nov 10',
      d: 'd1',
      d2: 'd2',
    },
    {
      id: 'c3',
      name: 'My App',
      b: 'B3',
      tag: 't3',
      cat: 'Productivity',
      host: 'Me',
      bg: '#fff',
      fg: '#000',
      ic: 'bolt',
      days: 25,
      n: 5,
      price: '0.50',
      end: 'Nov 17',
      d: 'd1',
      d2: 'd2',
      mine: 1,
    },
  ];

  const joinedMap = { c1: 2 };

  // Discover all
  const discoverAll = filterCampaigns(mockCampaigns, {
    tab: 'discover',
    category: 'All',
    sort: 0,
    joinedMap,
  });
  assert.equal(discoverAll.length, 2); // excludes mine

  // Discover category
  const discoverPhoto = filterCampaigns(mockCampaigns, {
    tab: 'discover',
    category: 'Photography',
    sort: 0,
    joinedMap,
  });
  assert.equal(discoverPhoto.length, 1);
  assert.equal(discoverPhoto[0].id, 'c1');

  // Discover sorted by price desc
  const sorted = filterCampaigns(mockCampaigns, {
    tab: 'discover',
    category: 'All',
    sort: 1,
    joinedMap,
  });
  assert.equal(sorted[0].id, 'c2'); // $0.80 > $0.40

  // Joined
  const joined = filterCampaigns(mockCampaigns, {
    tab: 'joined',
    category: 'All',
    sort: 0,
    joinedMap,
  });
  assert.equal(joined.length, 1);
  assert.equal(joined[0].id, 'c1');

  // Hosting
  const hosting = filterCampaigns(mockCampaigns, {
    tab: 'hosting',
    category: 'All',
    sort: 0,
    joinedMap,
  });
  assert.equal(hosting.length, 1);
  assert.equal(hosting[0].id, 'c3');
});
