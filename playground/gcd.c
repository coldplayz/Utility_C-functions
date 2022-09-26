#include <stdio.h>

/**
 * This function implements the Euclidean
 * Algorithm for finding the Greatest Common Denominator of a and b.
 */
int gcd(int a, int b)
{
	int rem, max, min;

	max = a > b ? a : b;
	min = a < b ? a : b;

	rem = max % min;
	if (rem == 0)
	{
		return (min);
	}

	return (gcd(min, rem));
}
