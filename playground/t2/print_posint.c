#include <unistd.h>
#include <stdlib.h>
#include "main.h"

/**
 * print_posint - prints the positive integer n
 * @n: the positive integer to print
 *
 * Return: the number of bytes written to STDOUT
 */
int print_posint(int n)
{
	int i, q, j, len = num_len(n), bytes_written = 0;
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
