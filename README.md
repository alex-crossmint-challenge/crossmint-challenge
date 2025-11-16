![](https://observatorioblockchain.com/wp-content/uploads/2023/06/crossmint-final-scaled.jpg)

# Crossmint Challenge

This is my own solution for the Crossmint Challenge.

I'm using Bun as the runtime, Biome as the linter and formatter and Zod as the schema validation.

On the project folder structure I have two folders:

- phase1: This is the solution for the first phase of the challenge.
- phase2: This is the solution for the second phase of the challenge.

I'm separating the solution in case you want to see how I think the solution on each phase, you will see that the solution on the second phase is more robust.

If you just want too see the final solution just check the phase2 folder.

## Prerequisites

.env file with the following variables:
```bash
CANDIDATE_ID=candidate_id
```

## How to install

```bash
bun install
```

## How to run

I focus the solution as a CLI application, so you can run it with the following command:


```bash
bun run phase1
```

```bash
bun run phase2
```

If you want to reset the map, you can use the following command:

```bash
bun run phase1 --reset
```

```bash
bun run phase2 --reset
```
---

Thanks for this opportunity team, I'm very grateful!