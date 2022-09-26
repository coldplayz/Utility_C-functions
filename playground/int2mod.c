#include <stdio.h>


/**
 * Converts num to mod
 */
long int int2mod(long int num, long int mod)
{
	if (num >= 0)
	{
		return (num % mod);
	}

	/* num is -ve */
	while (num < 0)
	{
		num += mod;
	}

	return (num);
}
