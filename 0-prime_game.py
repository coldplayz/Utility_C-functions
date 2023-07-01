#!/usr/bin/python3
""" The prime game puzzle.
"""


def isPrime(n):
    """ Determine if the number, n, is a prime number.
    """
    if type(n) is not int or n < 2:
        return False

    limit = n // 2
    divisors = 0
    # print(n)  # SCAFF

    for divisor in range(1, limit + 1):
        if (n % divisor) == 0:
            divisors += 1

        if divisors > 1:
            return False

    if divisors > 1:
        return False
    return True


def isWinner(x, nums):
    """ Solves the prime game puzzle.

    Maria and Ben are playing a game. Given a set of consecutive integers
    ...starting from 1 up to and including n, they take turns choosing a
    ...prime number from the set and removing that number and its multiples
    ...from the set. The player that cannot make a move loses the game.

    They play x rounds of the game, where n may be different for each round.
    Assuming Maria always goes first and
    ...both players play optimally, determine who the winner of each game is.

    Assumptions/requirements:
        - x is the number of rounds and nums is an array of n
        - Return: name of the player that won the most rounds
        - If the winner cannot be determined, return None
        - You can assume n and x will not be larger than 10000
        - You cannot import any packages in this task.

    Algorithm:
        - https://www.programming9.com/tutorials/competitive-programming
          /412-sieve-of-eratosthenes-fastest-algorithm-to-find-prime-numbers
        - the bottleneck was in finding prime numbers in a range from 1 to N;
          ...it becomes slower as N increases.
          To greatly improve the run time, the Eratosthenes Sieve was used.
        - This algorithm relies on what seems to be a mathematical fact;
          ...that in a range of size N, no prime number can exist
          ...beyond a limit number such that
          ...(limit_number ** 2) <= N and ((limit_number + 1) ** 2) > N.
        - To implement the seive, you record multiples/composites of all
          ...consecutive prime numbers up to the
          ...limit number (square root of N). The numbers in the range N that
          ...are not in the multiples record, by the time you hit the
          ...limit number, are prime numbers (except 1, of course).
    """
    if x < 1 or not isinstance(nums, list) or not nums:
        return None

    maria_wins = 0
    ben_wins = 0
    max_num = max(nums)
    multiples = []  # all multiples across rounds

    # use Eratosthenes Sieve to get primes in a range faster
    for n in range(1, max_num + 1):
        # record all multiples/composites for all primes
        # ...not greater than the square root of max_num
        if n in multiples:
            # n is not prime
            continue

        if (n ** 2) > max_num:
            break

        if isPrime(n):
            # record its multiples as non-prime
            max_multiple = max_num // n
            for i in range(2, max_multiple + 1):
                multiple = n * i
                if multiple not in multiples:
                    multiples.append(multiple)

    # process the collected data
    for num in nums:
        # get multiples for a specific round
        num_multiples = list(filter(lambda x: x <= num, multiples))
        # total multiples plus one for 1 (a non-prime)
        multiples_len = len(num_multiples) + 1
        # determine round winner
        num_primes = num - multiples_len

        if num_primes % 2 == 0:
            # Ben wins for even number of primes as Maria starts always
            ben_wins += 1
        else:
            # Maria wins for odd number of primes
            maria_wins += 1

    if maria_wins > ben_wins:
        return 'Maria'

    if maria_wins < ben_wins:
        return 'Ben'

    # else a tie
    return None
