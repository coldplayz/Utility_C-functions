#include <stdio.h>
#include "main.h"

/**
 * pwr - computes the power of an integer
 * @base: an integer base
 * @index: an integer power to raise the base to
 *
 * Return: an integer
 */
int pwr(int base, int index)
{
	int counter = 0, power = 1;

	while (counter < index)
	{
		power *= base;
		counter++;
	}

	return (power);
}
