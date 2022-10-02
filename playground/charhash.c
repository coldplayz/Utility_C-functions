#include <stdio.h>
#include <stdlib.h>
#include "main.h"


/**
 * charhash - returns a unique int for each alphabet, case in-sensitive.
 * @c: char to return a unique int for.
 *
 * Return: an int between 0 and 25, or -1 if c is not an alphabet.
 */
int charhash(char c)
{
	if (65 <= c && c <= 90)
	{
		return (c - 65);
	}

	if (97 <= c && c <= 122)
	{
		return (c - 97);
	}

	return (-1);
}
