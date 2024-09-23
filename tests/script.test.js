import { expect, test, describe} from 'vitest';
import { buildDeck, checkAce, getValue, reduceAce, shuffleDeck } from '../script';

describe('Blackjack buildDeck', () => {
  test('Should return a deck of cards', () =>  {
    // Arrange
    let numOfDecks = 7;
    // Act
    const deck = buildDeck(numOfDecks);
    const result = deck.length;
    // Assert
    expect(result).toBe(364);
  });
});

describe('Blackjack checkAce', () => {
  test('Checking it the card is an Ace or not', () => {
    expect(checkAce('A-C')).toBe(1);
    expect(checkAce('J-S')).toBe(0);
    expect(checkAce('2-H')).toBe(0);
  });
});

describe('Blackjack getValue', () => {
  test('Get the value of of 11 for an Ace cards', () => {
    expect(getValue('A-S')).toBe(11)
  });

  test('Get the value of of 10 for an King, Queen, and Jack cards', () => {
    expect(getValue('K-S')).toBe(10);
    expect(getValue('Q-C')).toBe(10);
    expect(getValue('J-H')).toBe(10);
  });

  test('Should get the value of a number card', () => {
    expect(getValue('2-C')).toBe(2);
    expect(getValue('7-H')).toBe(7);
    expect(getValue('9-S')).toBe(9);
  });
});

describe('Blackjack reduceAce', () => {
  test('Reduces a players sum if sum in greater than 21 and they have an Ace in their hand', ()=> {
    expect(reduceAce(22, 1)).toBe(12);
    expect(reduceAce(22, 2)).toBe(12)
  })

  test('Players sum should remain the same if equal to or less than 21', () => {
    expect(reduceAce(21,1)).toBe(21);
    expect(reduceAce(18,1)).toBe(18);
  });
});

describe('Blackjack shuffleDeck', () => { 

  const deck = ['A-C', '2-D', '3-H', '4-S'];

  test('The length of the deck should not change', () => {
    let orginalDeckLength = deck.length;
    shuffleDeck(deck);
    expect(deck.length).toBe(orginalDeckLength);
  })

  test('Should contain the same cards after shuffling', () => {
    const originalDeck = [...deck]; // Make a copy of the original deck
    shuffleDeck(deck);

    expect(deck).toEqual(expect.arrayContaining(originalDeck));
    expect(originalDeck).toEqual(expect.arrayContaining(deck));
  });

  test('Should shuffle deck into a different order', () => {
    let originalDeck = [...deck];
    let newDeck = shuffleDeck(deck);

    // Might fail due to small deck size;
    expect(newDeck).not.toEqual(originalDeck);
  })
});