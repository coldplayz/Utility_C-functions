#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * printS - prints the string s, handling non-printable characters
 * @s: a pointer to the string to print
 *
 * Return: a pointer to an array of two integers, respectively
 * representing number of bytes written/printed to STDOUT,
 * and a flag indicating whether the string was empty,
 * where 1 means empty, and 0 otherwise.
 */
int *printS(char *s)
{
	int  i, *pti, ai[2] = {0, 0}, len = _strlen(s);

	pti = ai;
	if (s == NULL)
	{
		pti[0] = 6;
		pti[1] = 0;
		write(1, "(null)", 6);
		return (pti);
	}
	for (i = 0; i < len; i++)
	{
		if ((s[i] > 0 && s[i] < 32) || (s[i] >= 127))
		{
			ai[0] += write(1, "\\x", 2);
			ai[0] += pah(s[i]);
		}
		else
		{
			ai[0] += write(1, c2s(s[i], 0, 0), 1);
		}
	}
	return (pti);
}
