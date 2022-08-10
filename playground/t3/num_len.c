#include "main.h"

/**
 * num_len - determines the length of an integer
 * @n: the integer whose length to determine
 *
 * Return: the length/width of n
 */
int num_len(long int n)
{
	long int q;
	int len = 1;

	q = n / 10;
	for (; q != 0; )
	{
		q = q / 10;
		len += 1;
	}

	return (len);
}
