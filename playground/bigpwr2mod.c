#include <stdio.h>

/**
 * This function provides a way of getting
 * the representation of a large power in
 * a given mod that avoids the overflow possible in C.
 */
long int bigpwr2mod(long int base, long int idx, long int mod)
{
	long int i, num;

	num = base;
	for (i = 1; i < idx; i++)
	{
		num = (num * base) % mod;
	}

	return (num);
}
