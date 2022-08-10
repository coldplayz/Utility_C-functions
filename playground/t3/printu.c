#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "main.h"

/**
 * printu - prints any unsigned integer
 * @n: the unsigned int to print
 *
 * Return: the number of bytes printed
 */
int printu(unsigned int n)
{
	int i, j, bytes_written = 0, len = num_len(n);
	unsigned int q;
	char *ptc;

	ptc = malloc(sizeof(char) * len + 1);
	if (ptc == NULL)
	{
		return (0);
	}
	j = 0;
	for (i = (len - 1); i >= 0; i--)
	{
		q = n % 10;
		n = n / 10;
		ptc[j] = q + '0';
		j++;
	}
	ptc[j] = 0;

	for (i = (len - 1); i >= 0; i--)
	{
		write(1, &ptc[i], 1);
		bytes_written++;
	}

	free(ptc);
	return (bytes_written);
}
