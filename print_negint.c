#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include "main.h"


/**
 * print_negint - prints the negative integer n
 * @n: the positive integer to print
 */
void print_negint(int n)
{
	int i, q, j, len = num_len(n);
	char *ptc;

	ptc = malloc(sizeof(char) * len + 2);
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
		ptc[j] = -q + '0';
		j++;
	}
	ptc[j++] = '-';
	ptc[j] = 0;

	for (i = len; i >= 0; i--)
	{
		write(1, &ptc[i], 1);
	}

	free(ptc);
}
