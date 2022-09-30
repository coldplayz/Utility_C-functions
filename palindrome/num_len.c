#include "lists.h"

/**
 * num_len2 - determines the length of an integer
 * @n: the integer whose length to determine
 *
 * Return: the length/width of n
 */
long int num_len2(long int n)
{
	long int q, len = 1;

	q = n / 10;
	for (; q != 0;)
	{
		q = q / 10;
		len += 1;
	}

	return (len);
}
