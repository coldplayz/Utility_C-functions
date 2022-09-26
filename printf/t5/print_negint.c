#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include "main.h"


/**
 * print_negint - prints the negative integer n
 * @n: the negative integer to print
 *
 * Return: the number of bytes written
 */
int print_negint(int n)
{
	int i, q, j, len = num_len(n), bytes_written = 0;
	char *ptc;

	ptc = malloc(sizeof(char) * len + 2);
	if (ptc == NULL)
	{
		return (0);
	}
	j = 0;
	for (i = (len - 1); i >= 0; i--)
	{
		q = n % 10;
		n = n / 10;
		ptc[j] = -q + '0';
		j++;
	}
	ptc[j++] = '-';
	ptc[j] = 0;

	for (i = len; i >= 0; i--)
	{
		write(1, &ptc[i], 1);
		bytes_written++;
	}

	free(ptc);
	return (bytes_written);
}
