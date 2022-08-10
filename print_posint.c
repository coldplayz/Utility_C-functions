#include <unistd.h>
#include <stdlib.h>
#include "main.h"

/**
 * print_posint - prints the positive integer n
 * @n: the positive integer to print
 */
void print_posint(int n)
{
	int i, q, j, len = num_len(n);
	char *ptc;

	ptc = malloc(sizeof(char) * len + 1);
	if (ptc == NULL)
	{
		write(1, "?", 1);
		exit(EXIT_FAILURE);
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
	}

	free(ptc);
}
