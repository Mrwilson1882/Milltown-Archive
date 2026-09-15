#!/usr/bin/env node
/**
 * Reserve order numbers ahead of time.
 *
 *   node invoicing/reserve-order-numbers.mjs        one number
 *   node invoicing/reserve-order-numbers.mjs 5      a block of five
 *   node invoicing/reserve-order-numbers.mjs --list what is reserved and unused
 *
 * An order gets its number the moment it comes in — usually on WhatsApp, long
 * before there is anything to invoice. Reserving a block up front means a number
 * can be quoted to the customer on the spot and the invoice picks up the same
 * one later.
 *
 * Reserved numbers sit in next-order-number.json until an invoice claims one,
 * which is what keeps the sequence gap-free.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "next-order-number.json");

const read = () => JSON.parse(readFileSync(FILE, "utf8"));
const write = (s) => writeFileSync(FILE, `${JSON.stringify(s, null, 2)}\n`);

export const formatOrder = (state, n) =>
  `${state.prefix}-${String(n).padStart(state.padding, "0")}`;

/** Reserve `count` numbers and return them. */
export function reserve(count = 1) {
  const state = read();
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const number = formatOrder(state, state.next + i);
    out.push(number);
    state.reserved.push({ number, reservedAt: new Date().toISOString(), usedOn: null });
  }
  state.next += count;
  write(state);
  return out;
}

/** Mark a reserved number as used by an invoice. Reserving is not the same as
 *  using: a number quoted to a customer who never ordered stays reserved and
 *  unused rather than silently going back in the pot. */
export function claim(number, invoiceNumber) {
  const state = read();
  const row = state.reserved.find((r) => r.number === number);
  if (row) row.usedOn = invoiceNumber;
  write(state);
}

/** The number the next invoice would take, without taking it: the oldest
 *  reserved-but-unused one, or the next unreserved. */
export function peek() {
  const state = read();
  const free = state.reserved.find((r) => !r.usedOn);
  return free ? free.number : formatOrder(state, state.next);
}

/** Take the oldest reserved-but-unused number, or reserve a fresh one. */
export function takeNext(invoiceNumber) {
  const state = read();
  const free = state.reserved.find((r) => !r.usedOn);
  if (free) {
    free.usedOn = invoiceNumber;
    write(state);
    return free.number;
  }
  const number = formatOrder(state, state.next);
  state.reserved.push({ number, reservedAt: new Date().toISOString(), usedOn: invoiceNumber });
  state.next += 1;
  write(state);
  return number;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.includes("--list")) {
    const state = read();
    const open = state.reserved.filter((r) => !r.usedOn);
    const used = state.reserved.filter((r) => r.usedOn);
    console.log(`Next number an invoice would take: ${peek()}\n`);
    console.log(`Reserved and free to give out (${open.length}):`);
    for (const r of open) console.log(`  ${r.number}`);
    console.log(`\nUsed (${used.length}):`);
    for (const r of used) console.log(`  ${r.number}  ->  ${r.usedOn}`);
  } else {
    const count = Math.max(1, Math.round(Number(args[0]) || 1));
    const numbers = reserve(count);
    console.log(`Reserved ${count} order number${count === 1 ? "" : "s"}:`);
    for (const n of numbers) console.log(`  ${n}`);
  }
}
